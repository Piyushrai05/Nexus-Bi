import unittest
from fastapi import HTTPException
from app.core.firebase import verify_token
from app.services.firestore_service import firestore_service
from app.schemas.auth import UserContext
from app.api.deps import get_current_user, get_optional_user
from app.api.routes.user import get_current_user_profile, get_user_workspace, get_user_preferences
from app.api.routes.analytics import get_executive_overview
from main import health_probe

class TestAuthAndCloudArchitecture(unittest.TestCase):

    def test_01_token_verification_rejection(self):
        """Rejects empty, malformed, or fake tokens."""
        self.assertIsNone(verify_token(""))
        self.assertIsNone(verify_token("invalid.jwt.token.string"))

    def test_02_demo_token_verification(self):
        """Verifies demo/testing tokens cleanly."""
        decoded = verify_token("demo-token-usr_exec99")
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["uid"], "usr_exec99")
        self.assertEqual(decoded["role"], "executive")

    def test_03_protected_route_requires_auth(self):
        """Protected dependency get_current_user raises 401 when no token is supplied."""
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(None)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Missing Authorization header", ctx.exception.detail)

    def test_04_protected_route_rejects_malformed_token(self):
        """Protected dependency get_current_user raises 401 for bad token format."""
        with self.assertRaises(HTTPException) as ctx:
            get_current_user("Token 12345")
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Invalid Authorization format", ctx.exception.detail)

    def test_05_protected_route_accepts_valid_token(self):
        """Protected dependency and user profile endpoint return 200 OK for verified token."""
        user = get_current_user("Bearer demo-token-usr_exec88")
        self.assertEqual(user.uid, "usr_exec88")
        self.assertEqual(user.role, "executive")

        res = get_current_user_profile(user=user)
        data = res.data
        self.assertEqual(data["user"]["uid"], "usr_exec88")
        self.assertEqual(data["workspace"]["owner_uid"], "usr_exec88")
        self.assertIn("theme", data["preferences"])

    def test_06_firestore_user_and_workspace_sync(self):
        """Tests Firestore metadata sync for user, workspace, and preferences."""
        user = UserContext(
            uid="usr_cloud_test_1",
            email="founder@nexusbi.io",
            name="Cloud Founder",
            role="executive",
            workspace_id="ws_cloud_test_1"
        )
        synced = firestore_service.sync_user(user)
        self.assertEqual(synced["uid"], "usr_cloud_test_1")
        
        ws = firestore_service.get_workspace(user.workspace_id, user.uid)
        self.assertEqual(ws.workspace_id, "ws_cloud_test_1")
        self.assertEqual(ws.owner_uid, "usr_cloud_test_1")

    def test_07_public_nexusmart_analytics_preserved_without_auth(self):
        """Ensures that all public DuckDB analytics continue working seamlessly for guests."""
        res = get_executive_overview()
        net_rev = next(k for k in res.data.kpis if k.id == "net_revenue")
        self.assertAlmostEqual(net_rev.current_value, 484713.26, delta=0.01)

    def test_08_health_check_endpoint(self):
        """Verifies top-level /health endpoint for Render zero-downtime deploy probe."""
        res = health_probe()
        self.assertEqual(res["status"], "healthy")
        self.assertEqual(res["engine"], "duckdb-embedded")

if __name__ == "__main__":
    unittest.main()
