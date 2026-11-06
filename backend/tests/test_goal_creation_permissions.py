import pytest

API = "/api/v1"


@pytest.mark.parametrize("actor,coach", [("reception_h", "coach1_id"), ("coach1_h", "coach2_id")])
def test_goal_creation_cannot_bypass_existing_coaching_permissions(client, seeded, actor, coach):
    response = client.post(f"{API}/goals", headers=seeded[actor], json={
        "athleteId": seeded["athlete1_id"], "coachId": seeded[coach],
        "title": "Permission probe", "category": "strength", "targetValue": 20,
        "currentValue": 5, "unit": "kg", "targetDate": "2026-12-31T00:00:00Z",
    })
    assert response.status_code == 403


def test_coach_can_create_and_edit_their_own_assigned_goal(client, seeded):
    created = client.post(f"{API}/goals", headers=seeded["coach1_h"], json={
        "athleteId": seeded["athlete1_id"], "coachId": seeded["coach1_id"],
        "title": "Owned goal", "category": "strength", "targetValue": 20,
        "currentValue": 5, "unit": "kg", "targetDate": "2026-12-31T00:00:00Z",
    })
    assert created.status_code == 200
    goal = created.json()["data"]
    updated = client.put(f"{API}/goals/{goal['id']}", headers=seeded["coach1_h"], json={"title": "Edited goal", "targetValue": 25})
    assert updated.status_code == 200
    assert updated.json()["data"]["targetValue"] == 25
