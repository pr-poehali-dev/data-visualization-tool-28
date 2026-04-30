"""
Аутентификация: регистрация, вход, выход, получение текущего пользователя.
"""
import json
import os
import secrets
import hashlib
import hmac
from datetime import datetime, timedelta
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest()
    return f"{salt}:{hashed}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt, hashed = password_hash.split(":", 1)
        expected = hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, hashed)
    except Exception:
        return False


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization, X-Session-Id",
    }


def handler(event: dict, context) -> dict:
    """Регистрация, вход, выход, профиль пользователя"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    conn = get_db()
    cur = conn.cursor()
    cur.execute(f"SET search_path TO {SCHEMA}")

    try:
        # POST /auth/login
        if method == "POST" and "/login" in path:
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")

            cur.execute("SELECT id, email, password_hash, name, role, status FROM users WHERE email = %s", (email,))
            row = cur.fetchone()

            if not row:
                return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"error": "Неверный email или пароль"}), "isBase64Encoded": False}

            user_id, email_db, pw_hash, name, role, status = row

            if status == "blocked":
                return {"statusCode": 403, "headers": cors_headers(), "body": json.dumps({"error": "Аккаунт заблокирован"}), "isBase64Encoded": False}

            if not verify_password(password, pw_hash):
                return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"error": "Неверный email или пароль"}), "isBase64Encoded": False}

            token = secrets.token_urlsafe(48)
            expires = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires)
            )
            cur.execute("UPDATE users SET last_login_at = NOW() WHERE id = %s", (user_id,))
            cur.execute(
                "INSERT INTO user_activity_log (user_id, action, details) VALUES (%s, %s, %s)",
                (user_id, "login", "Успешный вход")
            )
            conn.commit()

            return {
                "statusCode": 200,
                "headers": cors_headers(),
                "body": json.dumps({"token": token, "user": {"id": user_id, "email": email_db, "name": name, "role": role}}),
                "isBase64Encoded": False,
            }

        # POST /auth/register
        elif method == "POST" and "/register" in path:
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            name = body.get("name", "")

            if not email or not password:
                return {"statusCode": 400, "headers": cors_headers(), "body": json.dumps({"error": "Email и пароль обязательны"}), "isBase64Encoded": False}

            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return {"statusCode": 409, "headers": cors_headers(), "body": json.dumps({"error": "Пользователь уже существует"}), "isBase64Encoded": False}

            pw_hash = hash_password(password)
            cur.execute(
                "INSERT INTO users (email, password_hash, name, role, status) VALUES (%s, %s, %s, 'user', 'active') RETURNING id",
                (email, pw_hash, name)
            )
            user_id = cur.fetchone()[0]

            token = secrets.token_urlsafe(48)
            expires = datetime.utcnow() + timedelta(days=30)
            cur.execute(
                "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires)
            )
            conn.commit()

            return {
                "statusCode": 200,
                "headers": cors_headers(),
                "body": json.dumps({"token": token, "user": {"id": user_id, "email": email, "name": name, "role": "user"}}),
                "isBase64Encoded": False,
            }

        # GET /auth/me
        elif method == "GET" and "/me" in path:
            auth_header = event.get("headers", {}).get("X-Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()
            if not token:
                return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"error": "Токен не передан"}), "isBase64Encoded": False}

            cur.execute(
                "SELECT u.id, u.email, u.name, u.role, u.status, u.subscription, u.created_at FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.token = %s AND s.expires_at > NOW()",
                (token,)
            )
            row = cur.fetchone()
            if not row:
                return {"statusCode": 401, "headers": cors_headers(), "body": json.dumps({"error": "Сессия истекла"}), "isBase64Encoded": False}

            uid, email, name, role, status, sub, created = row
            return {
                "statusCode": 200,
                "headers": cors_headers(),
                "body": json.dumps({"id": uid, "email": email, "name": name, "role": role, "status": status, "subscription": sub, "created_at": str(created)}),
                "isBase64Encoded": False,
            }

        # POST /auth/logout
        elif method == "POST" and "/logout" in path:
            auth_header = event.get("headers", {}).get("X-Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()
            if token:
                cur.execute("UPDATE user_sessions SET expires_at = NOW() WHERE token = %s", (token,))
                conn.commit()
            return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps({"ok": True}), "isBase64Encoded": False}

        else:
            return {"statusCode": 404, "headers": cors_headers(), "body": json.dumps({"error": "Not found"}), "isBase64Encoded": False}

    finally:
        cur.close()
        conn.close()
