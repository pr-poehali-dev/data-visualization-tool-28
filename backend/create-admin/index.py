"""
Одноразовая функция создания администратора (owner).
Безопасна: не перезаписывает уже существующего пользователя.
"""
import json
import os
import secrets
import hashlib
import hmac
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

ADMIN_EMAIL = "elenalazareva88@yandex.ru"
ADMIN_PASSWORD = "TktyfBrbhf12"
ADMIN_NAME = "Elena Lazareva"
ADMIN_ROLE = "owner"


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest()
    return f"{salt}:{hashed}"


def handler(event: dict, context) -> dict:
    """Создание учётной записи администратора (owner)"""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": "",
            "isBase64Encoded": False,
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    try:
        cur.execute(f'SELECT id, role FROM "{SCHEMA}".users WHERE email = %s', (ADMIN_EMAIL,))
        existing = cur.fetchone()

        if existing:
            user_id, role = existing
            if role != ADMIN_ROLE:
                cur.execute(f'UPDATE "{SCHEMA}".users SET role = %s WHERE id = %s', (ADMIN_ROLE, user_id))
                conn.commit()
            return {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
                "body": json.dumps({"ok": True, "message": f"Пользователь уже существует (id={user_id}), роль: {ADMIN_ROLE}"}),
                "isBase64Encoded": False,
            }

        pw_hash = hash_password(ADMIN_PASSWORD)
        cur.execute(
            f'INSERT INTO "{SCHEMA}".users (email, password_hash, name, role, status, subscription) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id',
            (ADMIN_EMAIL, pw_hash, ADMIN_NAME, ADMIN_ROLE, "active", "premium")
        )
        user_id = cur.fetchone()[0]
        cur.execute(
            f'INSERT INTO "{SCHEMA}".user_activity_log (user_id, action, details) VALUES (%s, %s, %s)',
            (user_id, "account_created", "Учётная запись администратора создана автоматически")
        )
        conn.commit()

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
            "body": json.dumps({
                "ok": True,
                "message": "Администратор создан успешно",
                "user_id": user_id,
                "email": ADMIN_EMAIL,
                "role": ADMIN_ROLE,
            }),
            "isBase64Encoded": False,
        }

    finally:
        cur.close()
        conn.close()
