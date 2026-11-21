from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.schemas.auth import UserContext, WorkspaceModel, UserPreferences
from app.schemas.common import StandardResponse, ResponseMeta
from app.services.firestore_service import firestore_service

router = APIRouter(prefix="/user", tags=["User & Cloud Workspaces"])

@router.get("/me", response_model=StandardResponse[dict])
def get_current_user_profile(user: UserContext = Depends(get_current_user)):
    user_record = firestore_service.sync_user(user)
    workspace = firestore_service.get_workspace(user.workspace_id, user.uid)
    prefs = firestore_service.get_preferences(user.uid)

    return StandardResponse(
        data={
            "user": user_record,
            "workspace": workspace.model_dump(),
            "preferences": prefs.model_dump(),
        },
        meta=ResponseMeta(
            method="firebase_auth_firestore",
            confidence="high",
            confidence_reason="Verified via Firebase ID token and Firestore document store.",
            data_source="firestore_users"
        )
    )

@router.get("/workspaces", response_model=StandardResponse[WorkspaceModel])
def get_user_workspace(user: UserContext = Depends(get_current_user)):
    ws = firestore_service.get_workspace(user.workspace_id, user.uid)
    return StandardResponse(
        data=ws,
        meta=ResponseMeta(
            method="firestore",
            confidence="high",
            data_source="firestore_workspaces"
        )
    )

@router.get("/preferences", response_model=StandardResponse[UserPreferences])
def get_user_preferences(user: UserContext = Depends(get_current_user)):
    prefs = firestore_service.get_preferences(user.uid)
    return StandardResponse(
        data=prefs,
        meta=ResponseMeta(
            method="firestore",
            confidence="high",
            data_source="firestore_user_preferences"
        )
    )

@router.put("/preferences", response_model=StandardResponse[UserPreferences])
def update_user_preferences(prefs: UserPreferences, user: UserContext = Depends(get_current_user)):
    firestore_service.save_preferences(user.uid, prefs)
    return StandardResponse(
        data=prefs,
        meta=ResponseMeta(
            method="firestore_write",
            confidence="high",
            data_source="firestore_user_preferences"
        )
    )
