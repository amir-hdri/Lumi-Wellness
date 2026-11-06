from datetime import datetime, timedelta, timezone

API = "/api/v1"


def own_membership(client, seeded):
    return client.get(f"{API}/memberships", headers=seeded["athlete1_h"]).json()["data"][0]


def test_athlete_cannot_grant_themselves_a_new_term(client, seeded):
    membership = own_membership(client, seeded)
    response = client.post(f"{API}/memberships/{membership['id']}/renew", headers=seeded["athlete1_h"], json={
        "endDate": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(), "sessionsTotal": 99999,
    })
    assert response.status_code == 403


def test_reception_cannot_approve_a_renewal(client, seeded):
    membership = own_membership(client, seeded)
    response = client.post(f"{API}/memberships/{membership['id']}/renew", headers=seeded["reception_h"], json={
        "endDate": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
    })
    assert response.status_code == 403


def test_reception_cannot_bypass_approval_through_generic_edit(client, seeded):
    membership = own_membership(client, seeded)
    response = client.put(f"{API}/memberships/{membership['id']}", headers=seeded["reception_h"], json={
        "endDate": (datetime.fromisoformat(membership["endDate"]) + timedelta(days=365)).isoformat(),
        "sessionsTotal": membership["sessionsTotal"] + 100,
    })
    assert response.status_code == 403


def test_reception_cannot_bypass_approval_by_creating_another_term(client, seeded):
    membership = own_membership(client, seeded)
    response = client.post(f"{API}/memberships", headers=seeded["reception_h"], json={
        "userId": membership["userId"], "planId": membership["planId"], "branchId": membership["branchId"],
        "startDate": membership["startDate"],
        "endDate": (datetime.fromisoformat(membership["endDate"]) + timedelta(days=365)).isoformat(),
        "sessionsTotal": 100, "price": 1000, "finalPrice": 1000,
    })
    assert response.status_code == 403


def test_request_is_private_idempotent_and_does_not_grant_entitlements(client, seeded):
    membership = own_membership(client, seeded)
    path = f"{API}/memberships/{membership['id']}/renewal-request"
    assert client.post(path, headers=seeded["athlete2_h"]).status_code == 403
    assert client.post(path, headers=seeded["coach1_h"]).status_code == 403
    first = client.post(path, headers=seeded["athlete1_h"])
    assert first.status_code == 200, first.text
    data = first.json()["data"]
    assert data["renewalRequestedAt"]
    for field in ("endDate", "sessionsTotal", "sessionsUsed", "status"):
        assert data[field] == membership[field]
    second = client.post(path, headers=seeded["athlete1_h"]).json()["data"]
    assert second["renewalRequestedAt"] == data["renewalRequestedAt"]


def test_admin_approval_persists_and_rejects_shortening_the_term(client, seeded):
    membership = own_membership(client, seeded)
    requested = client.post(f"{API}/memberships/{membership['id']}/renewal-request", headers=seeded["athlete1_h"])
    assert requested.status_code == 200
    old_end = datetime.fromisoformat(membership["endDate"])
    path = f"{API}/memberships/{membership['id']}/renew"
    assert client.post(path, headers=seeded["admin_h"], json={"endDate": (old_end - timedelta(days=1)).isoformat()}).status_code == 400
    approved = client.post(path, headers=seeded["admin_h"], json={
        "endDate": (old_end + timedelta(days=30)).isoformat(), "sessionsTotal": 15,
    })
    assert approved.status_code == 200
    data = approved.json()["data"]
    assert data["renewalApprovedBy"] == seeded["admin_id"]
    assert data["renewalApprovedAt"] >= data["renewalRequestedAt"]
    assert data["sessionsTotal"] == 15 and data["sessionsUsed"] == 0
    persisted = own_membership(client, seeded)
    assert persisted["renewalApprovedAt"] == data["renewalApprovedAt"]


def test_admin_membership_edit_persists_the_fields_the_form_offers(client, seeded):
    membership = own_membership(client, seeded)
    start = datetime.fromisoformat(membership["startDate"]) - timedelta(days=1)
    response = client.put(f"{API}/memberships/{membership['id']}", headers=seeded["admin_h"], json={
        "startDate": start.isoformat(), "price": 1234, "discountAmount": 234, "finalPrice": 1000,
    })
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["price"] == 1234 and data["discountAmount"] == 234 and data["finalPrice"] == 1000
    assert datetime.fromisoformat(data["startDate"]) == start


def test_inconsistent_membership_price_edit_is_rejected_atomically(client, seeded):
    membership = own_membership(client, seeded)
    response = client.put(f"{API}/memberships/{membership['id']}", headers=seeded["admin_h"], json={
        "price": 1200, "discountAmount": 200, "finalPrice": 999,
    })
    assert response.status_code == 400
    saved = own_membership(client, seeded)
    assert saved["price"] == membership["price"] and saved["finalPrice"] == membership["finalPrice"]
