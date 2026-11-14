import pytest


def test_member_login_variations(client, tokens):
    # Create a member with phone and external email
    member_email = "member.athlete@gmail.com"
    member_phone = "09101974842"
    password = "Password123"

    res = client.post(
        "/api/v1/users",
        headers=tokens["ADH"],
        json={
            "email": member_email,
            "password": password,
            "firstName": "سارینا",
            "lastName": "خداویسی",
            "phone": member_phone,
            "role": "athlete",
        },
    )
    assert res.status_code == 200, res.text

    # 1. Login with exact email
    r1 = client.post("/api/v1/auth/login", json={"email": member_email, "password": password})
    assert r1.status_code == 200, r1.text
    assert r1.json()["data"]["user"]["email"] == member_email

    # 2. Login with standard mobile number
    r2 = client.post("/api/v1/auth/login", json={"email": "09101974842", "password": password})
    assert r2.status_code == 200, r2.text
    assert r2.json()["data"]["user"]["email"] == member_email

    # 3. Login with +98 mobile format
    r3 = client.post("/api/v1/auth/login", json={"email": "+989101974842", "password": password})
    assert r3.status_code == 200, r3.text

    # 4. Login with 9-digit (no leading 0) format
    r4 = client.post("/api/v1/auth/login", json={"email": "9101974842", "password": password})
    assert r4.status_code == 200, r4.text

    # 5. Login with Persian digits in phone
    r5 = client.post("/api/v1/auth/login", json={"email": "۰۹۱۰۱۹۷۴۸۴۲", "password": password})
    assert r5.status_code == 200, r5.text

    # 6. Login with username prefix (before @)
    r6 = client.post("/api/v1/auth/login", json={"email": "member.athlete", "password": password})
    assert r6.status_code == 200, r6.text

    # 7. Login with Persian digits in password
    persian_pw = "Password۱۲۳"
    r7 = client.post("/api/v1/auth/login", json={"email": "09101974842", "password": persian_pw})
    assert r7.status_code == 200, r7.text

    # 8. Wrong password fails with 401
    r8 = client.post("/api/v1/auth/login", json={"email": "09101974842", "password": "WrongPassword99"})
    assert r8.status_code == 401
