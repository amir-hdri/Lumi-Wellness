from datetime import datetime
from uuid import uuid4

import pytest

API = "/api/v1"


@pytest.fixture
def member(client, seeded):
    auth = client.post(f"{API}/auth/register", json={
        "email": f"tz-{uuid4().hex}@example.test", "password": "TestPass123",
        "firstName": "Time", "lastName": "Probe", "phone": "",
    }).json()["data"]
    branch = client.get(f"{API}/branches", headers=seeded["admin_h"]).json()["data"][0]
    return {"userId": auth["user"]["id"], "branchId": branch["id"]}


def test_attendance_offsets_are_converted_to_utc_before_storage(client, seeded, member):
    opened = client.post(f"{API}/check-ins", headers=seeded["admin_h"], json={
        **member, "checkInTime": "2026-10-31T10:00:00+03:30",
    })
    assert opened.status_code == 200
    data = opened.json()["data"]
    assert datetime.fromisoformat(data["checkInTime"]) == datetime.fromisoformat("2026-10-31T06:30:00+00:00")
    closed = client.put(f"{API}/check-ins/{data['id']}/checkout", headers=seeded["admin_h"], json={
        "checkOutTime": "2026-10-31T08:00:00Z",
    })
    assert closed.status_code == 200, closed.text
    assert closed.json()["data"]["durationMinutes"] == 90


def test_checkout_compares_instants_instead_of_local_wall_times(client, seeded, member):
    opened = client.post(f"{API}/check-ins", headers=seeded["admin_h"], json={
        **member, "checkInTime": "2026-10-31T10:00:00Z",
    }).json()["data"]
    response = client.put(f"{API}/check-ins/{opened['id']}/checkout", headers=seeded["admin_h"], json={
        "checkOutTime": "2026-10-31T12:00:00+03:30",
    })
    assert response.status_code == 400
    rows = client.get(f"{API}/check-ins", headers=seeded["admin_h"], params={"userId": member["userId"]}).json()["data"]
    assert rows[0]["checkOutTime"] is None


def test_naive_attendance_times_keep_the_existing_utc_contract(client, seeded, member):
    opened = client.post(f"{API}/check-ins", headers=seeded["admin_h"], json={
        **member, "checkInTime": "2026-10-31T10:00:00",
    }).json()["data"]
    closed = client.put(f"{API}/check-ins/{opened['id']}/checkout", headers=seeded["admin_h"], json={
        "checkOutTime": "2026-10-31T11:00:00",
    })
    assert closed.status_code == 200
    assert closed.json()["data"]["durationMinutes"] == 60
