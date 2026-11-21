import datetime
from typing import Dict, Any, List, Optional
from firebase_admin import firestore
from app.core.config import settings
from app.core.logging import logger
from app.schemas.auth import UserContext, WorkspaceModel, DatasetMetadataFirestore, UserPreferences

class FirestoreService:
    def __init__(self):
        self._memory_users: Dict[str, Dict[str, Any]] = {}
        self._memory_workspaces: Dict[str, Dict[str, Any]] = {}
        self._memory_datasets: Dict[str, Dict[str, Any]] = {}
        self._memory_reports: Dict[str, Dict[str, Any]] = {}
        self._memory_preferences: Dict[str, Dict[str, Any]] = {}

    def get_client(self):
        # In local development or testing without credentials, use fast in-memory store
        if not (settings.FIREBASE_CREDENTIALS_PATH or settings.FIREBASE_SERVICE_ACCOUNT_JSON):
            return None
        try:
            return firestore.client()
        except Exception as e:
            logger.debug(f"Firestore live client unavailable ({e}), using in-memory store.")
            return None

    def sync_user(self, user: UserContext) -> Dict[str, Any]:
        """Syncs or creates a user record in Firestore."""
        now = datetime.datetime.utcnow().isoformat()
        user_data = {
            "uid": user.uid,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "active_workspace_id": user.workspace_id,
            "last_login": now,
        }

        db = self.get_client()
        if db:
            try:
                doc_ref = db.collection("users").document(user.uid)
                doc_ref.set(user_data, merge=True)
                logger.info(f"Synced user {user.uid} to Firestore 'users' collection.")
            except Exception as e:
                logger.warning(f"Failed to write user to Firestore: {e}")

        self._memory_users[user.uid] = user_data
        return user_data

    def get_workspace(self, workspace_id: str, owner_uid: str) -> WorkspaceModel:
        """Retrieves or provisions a tenant workspace."""
        db = self.get_client()
        if db:
            try:
                doc = db.collection("workspaces").document(workspace_id).get()
                if doc.exists:
                    return WorkspaceModel(**doc.to_dict())
            except Exception as e:
                logger.warning(f"Failed to read workspace from Firestore: {e}")

        # Provision default
        now = datetime.datetime.utcnow().isoformat()
        ws = WorkspaceModel(
            workspace_id=workspace_id,
            name="Enterprise Omnichannel Group",
            owner_uid=owner_uid,
            members=[owner_uid],
            created_at=now,
            settings={"currency": "USD", "timezone": "UTC", "anomaly_sensitivity": "medium"}
        )

        if db:
            try:
                db.collection("workspaces").document(workspace_id).set(ws.dict(), merge=True)
            except Exception as e:
                logger.warning(f"Failed to save workspace to Firestore: {e}")

        self._memory_workspaces[workspace_id] = ws.model_dump()
        return ws

    def register_dataset(self, metadata: DatasetMetadataFirestore) -> None:
        """Saves custom uploaded dataset metadata to Firestore."""
        db = self.get_client()
        if db:
            try:
                db.collection("datasets").document(metadata.dataset_id).set(metadata.model_dump(), merge=True)
                logger.info(f"Registered dataset {metadata.dataset_id} in Firestore.")
            except Exception as e:
                logger.warning(f"Failed to register dataset in Firestore: {e}")

        self._memory_datasets[metadata.dataset_id] = metadata.model_dump()

    def list_user_datasets(self, uid: str) -> List[Dict[str, Any]]:
        """Lists custom datasets owned by the authenticated user."""
        db = self.get_client()
        if db:
            try:
                docs = db.collection("datasets").where("owner_uid", "==", uid).stream()
                return [d.to_dict() for d in docs]
            except Exception as e:
                logger.warning(f"Failed to stream user datasets: {e}")

        return [d for d in self._memory_datasets.values() if d.get("owner_uid") == uid]

    def save_preferences(self, uid: str, prefs: UserPreferences) -> None:
        """Saves user preferences to Firestore."""
        db = self.get_client()
        if db:
            try:
                db.collection("user_preferences").document(uid).set(prefs.dict(), merge=True)
            except Exception as e:
                logger.warning(f"Failed to save preferences to Firestore: {e}")

        self._memory_preferences[uid] = prefs.dict()

    def get_preferences(self, uid: str) -> UserPreferences:
        """Retrieves user preferences from Firestore."""
        db = self.get_client()
        if db:
            try:
                doc = db.collection("user_preferences").document(uid).get()
                if doc.exists:
                    return UserPreferences(**doc.to_dict())
            except Exception as e:
                logger.warning(f"Failed to read preferences: {e}")

        stored = self._memory_preferences.get(uid)
        return UserPreferences(**stored) if stored else UserPreferences()

firestore_service = FirestoreService()
