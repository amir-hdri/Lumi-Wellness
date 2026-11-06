import pytest
from pydantic import ValidationError

from app.schemas import PaymentCreate


@pytest.mark.parametrize("amount", ["Infinity", "1e9999", float("inf")])
def test_nonfinite_payment_amounts_are_rejected(client, amount):
    with pytest.raises(ValidationError):
        PaymentCreate.model_validate({"userId": "member", "amount": amount})
