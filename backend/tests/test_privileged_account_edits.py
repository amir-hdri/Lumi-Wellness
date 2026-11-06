from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

API = "/api/v1"


@pytest.mark.parametrize("role", ["admin", "receptionist", "coach"])
def test_reception_cannot_create_privileged_accounts(client, seeded, role):
    response = client.post(f"{API}/users", headers=seeded["reception_h"], json={
        "email": f"privilege-{uuid4().hex}@example.test", "password": "StrongPass123",
        "firstName": "Protected", "lastName": "Account", "role": role,
    })
    assert response.status_code == 403


@pytest.mark.parametrize("role", ["admin", "coach"])
def test_reception_cannot_edit_privileged_login_identity(client, seeded, role):
    account = client.post(f"{API}/users", headers=seeded["admin_h"], json={
        "email": f"protected-{uuid4().hex}@example.test", "password": "StrongPass123",
        "firstName": "Protected", "lastName": "Account", "role": role,
    }).json()["data"]
    response = client.put(f"{API}/users/{account['id']}", headers=seeded["reception_h"], json={
        "email": f"receiver-{uuid4().hex}@example.test",
    })
    assert response.status_code == 403
    unchanged = client.get(f"{API}/users/{account['id']}", headers=seeded["admin_h"]).json()["data"]
    assert unchanged["email"] == account["email"]
    assert client.patch(f"{API}/users/{account['id']}/status", headers=seeded["reception_h"], json={"status": "suspended"}).status_code == 403


def test_generic_self_edit_cannot_bypass_immutable_profile_email(client, seeded):
    email = f"self-{uuid4().hex}@example.test"
    auth = client.post(f"{API}/auth/register", json={
        "email": email, "password": "StrongPass123", "firstName": "Self", "lastName": "Account",
    }).json()["data"]
    headers = {"Authorization": f"Bearer {auth['tokens']['accessToken']}"}
    response = client.put(f"{API}/users/{auth['user']['id']}", headers=headers, json={"email": f"other-{uuid4().hex}@example.test"})
    assert response.status_code == 403
    assert client.get(f"{API}/auth/profile", headers=headers).json()["data"]["email"] == email


@pytest.mark.parametrize("route", ["users", "auth/profile"])
def test_null_profile_fields_are_rejected_before_corrupting_an_account(client, route):
    auth = client.post(f"{API}/auth/register", json={
        "email": f"null-{uuid4().hex}@example.test", "password": "StrongPass123",
        "firstName": "Valid", "lastName": "Account", "phone": "09123456789",
    }).json()["data"]
    headers = {"Authorization": f"Bearer {auth['tokens']['accessToken']}"}
    path = f"{API}/users/{auth['user']['id']}" if route == "users" else f"{API}/auth/profile"
    probe = TestClient(client.app, raise_server_exceptions=False)
    try:
        response = probe.put(path, headers=headers, json={"phone": None})
        assert response.status_code in (400, 422)
        assert client.get(f"{API}/auth/profile", headers=headers).json()["data"]["phone"] == "09123456789"
    finally:
        probe.close()


@pytest.mark.parametrize("changes", [{"email": "invalid"}, {"status": "unknown"}, {"branchId": "missing-branch"}])
def test_admin_identity_edits_reject_invalid_values_atomically(client, seeded, changes):
    account = client.post(f"{API}/users", headers=seeded["admin_h"], json={
        "email": f"validation-{uuid4().hex}@example.test", "password": "StrongPass123",
        "firstName": "Valid", "lastName": "Account",
    }).json()["data"]
    response = client.put(f"{API}/users/{account['id']}", headers=seeded["admin_h"], json={"firstName": "Changed", **changes})
    assert response.status_code in (400, 404, 422)
    unchanged = client.get(f"{API}/users/{account['id']}", headers=seeded["admin_h"]).json()["data"]
    assert unchanged["firstName"] == "Valid"


def test_reception_can_still_create_and_edit_members(client, seeded):
    account = client.post(f"{API}/users", headers=seeded["reception_h"], json={
        "email": f"member-{uuid4().hex}@example.test", "password": "StrongPass123",
        "firstName": "Member", "lastName": "Account", "role": "athlete",
    }).json()["data"]
    changed = client.put(f"{API}/users/{account['id']}", headers=seeded["reception_h"], json={"firstName": "Changed"})
    assert changed.status_code == 200
    assert changed.json()["data"]["firstName"] == "Changed"
