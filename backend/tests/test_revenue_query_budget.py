from sqlalchemy import event
from datetime import datetime, timedelta
import pytest


@pytest.mark.parametrize("period", ["daily", "monthly"])
def test_revenue_uses_one_bounded_payment_query(client, seeded, period):
    from app.database import engine
    queries = []

    def observe(connection, cursor, statement, parameters, context, many):
        if statement.lstrip().upper().startswith("SELECT") and "FROM payments" in statement:
            queries.append(statement)

    event.listen(engine, "before_cursor_execute", observe)
    try:
        response = client.get(f"/api/v1/dashboard/revenue?period={period}&months=6", headers=seeded["admin_h"])
    finally:
        event.remove(engine, "before_cursor_execute", observe)
    assert response.status_code == 200
    data = response.json()["data"]
    assert len(data["labels"]) == len(data["values"]) == (30 if period == "daily" else 6)
    assert data["labels"] == sorted(data["labels"])
    # Authentication's relationship loader may also read payments. Count only
    # the chart's direct projection; it must not scale with the bucket count.
    chart_queries = [q for q in queries if "payments.amount" in q and "payments.id" not in q]
    assert len(chart_queries) == 1
    assert "payments.created_at >=" in chart_queries[0] and "payments.created_at <" in chart_queries[0]


@pytest.mark.parametrize("period", ["daily", "monthly"])
def test_revenue_preserves_totals_and_excludes_pending_and_outside_window(client, seeded, monkeypatch, period):
    from app.database import SessionLocal
    from app.models import Payment
    from app.routers import dashboard

    now = datetime(2040, 3, 15, 12)
    monkeypatch.setattr(dashboard, "_utcnow_naive", lambda: now)
    with SessionLocal() as db:
        payments = [
            Payment(user_id=seeded["athlete1_id"], amount=120, status="completed", created_at=now),
            Payment(user_id=seeded["athlete1_id"], amount=80, status="completed", created_at=now - timedelta(days=1)),
            Payment(user_id=seeded["athlete1_id"], amount=500, status="pending", created_at=now),
            Payment(user_id=seeded["athlete1_id"], amount=900, status="completed", created_at=now + timedelta(days=45)),
        ]
        db.add_all(payments)
        db.commit()
        try:
            response = client.get(f"/api/v1/dashboard/revenue?period={period}&months=2", headers=seeded["admin_h"])
            assert response.status_code == 200
            data = response.json()["data"]
            assert sum(data["values"]) == 200
            assert data["values"][-1] == (120 if period == "daily" else 200)
            assert data["values"][0] == 0
        finally:
            for payment in payments:
                db.delete(payment)
            db.commit()
