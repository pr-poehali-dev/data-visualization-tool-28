"""
Admin API: управление пользователями, статистика, тикеты, контент, настройки.
"""
import json
import os
from datetime import datetime, timedelta
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    }


def check_admin(event, cur):
    auth_header = event.get("headers", {}).get("X-Authorization", "")
    token = auth_header.replace("Bearer ", "").strip()
    if not token:
        return None
    cur.execute(
        "SELECT u.id, u.role FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    if not row or row[1] not in ("admin", "owner"):
        return None
    return row[0]


def ok(data):
    return {"statusCode": 200, "headers": cors_headers(), "body": json.dumps(data, default=str), "isBase64Encoded": False}


def err(msg, code=403):
    return {"statusCode": code, "headers": cors_headers(), "body": json.dumps({"error": msg}), "isBase64Encoded": False}


def handler(event: dict, context) -> dict:
    """Admin API — управление пользователями, статистика, тикеты"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    qs = event.get("queryStringParameters") or {}
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
        admin_id = check_admin(event, cur)
        if not admin_id:
            return err("Доступ запрещён — требуются права администратора", 403)

        # --- DASHBOARD STATS ---
        if "/stats" in path:
            cur.execute("SELECT COUNT(*) FROM users")
            total_users = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '1 day'")
            new_today = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days'")
            new_week = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'")
            new_month = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM users WHERE last_login_at > NOW() - INTERVAL '1 hour'")
            online_now = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'paid'")
            paid_orders = cur.fetchone()[0]

            cur.execute("SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status = 'paid'")
            total_revenue = float(cur.fetchone()[0])

            cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'paid' AND created_at > NOW() - INTERVAL '30 days'")
            revenue_month_count = cur.fetchone()[0]

            cur.execute("SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status = 'paid' AND created_at > NOW() - INTERVAL '30 days'")
            revenue_month = float(cur.fetchone()[0])

            cur.execute("SELECT COUNT(*) FROM support_tickets WHERE status = 'new'")
            open_tickets = cur.fetchone()[0]

            return ok({
                "total_users": total_users,
                "new_today": new_today,
                "new_week": new_week,
                "new_month": new_month,
                "online_now": online_now,
                "paid_orders": paid_orders,
                "total_revenue": total_revenue,
                "revenue_month": revenue_month,
                "revenue_month_count": revenue_month_count,
                "open_tickets": open_tickets,
            })

        # --- USERS LIST ---
        elif "/users" in path and method == "GET" and "user_id" not in qs:
            status_filter = qs.get("status", "")
            role_filter = qs.get("role", "")
            search = qs.get("search", "")
            limit = int(qs.get("limit", 50))
            offset = int(qs.get("offset", 0))

            where = ["1=1"]
            params = []
            if status_filter:
                where.append("status = %s"); params.append(status_filter)
            if role_filter:
                where.append("role = %s"); params.append(role_filter)
            if search:
                where.append("(email ILIKE %s OR name ILIKE %s)"); params.extend([f"%{search}%", f"%{search}%"])

            where_sql = " AND ".join(where)
            cur.execute(
                f"SELECT id, email, name, role, status, subscription, last_login_at, created_at FROM users WHERE {where_sql} ORDER BY created_at DESC LIMIT %s OFFSET %s",
                params + [limit, offset]
            )
            rows = cur.fetchall()
            cur.execute(f"SELECT COUNT(*) FROM users WHERE {where_sql}", params)
            total = cur.fetchone()[0]

            users = [{"id": r[0], "email": r[1], "name": r[2], "role": r[3], "status": r[4], "subscription": r[5], "last_login_at": str(r[6]) if r[6] else None, "created_at": str(r[7])} for r in rows]
            return ok({"users": users, "total": total})

        # --- USER ACTION (block/unblock/role/reset) ---
        elif "/users" in path and method == "POST":
            user_id = body.get("user_id")
            action = body.get("action")

            if action == "block":
                cur.execute("UPDATE users SET status = 'blocked' WHERE id = %s", (user_id,))
                cur.execute("UPDATE user_sessions SET expires_at = NOW() WHERE user_id = %s", (user_id,))
            elif action == "unblock":
                cur.execute("UPDATE users SET status = 'active' WHERE id = %s", (user_id,))
            elif action == "set_role":
                new_role = body.get("role", "user")
                cur.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user_id))
            elif action == "reset_password":
                import secrets, hashlib, hmac
                new_pass = secrets.token_urlsafe(10)
                salt = secrets.token_hex(16)
                hashed = hmac.new(salt.encode(), new_pass.encode(), hashlib.sha256).hexdigest()
                pw_hash = f"{salt}:{hashed}"
                cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (pw_hash, user_id))
                conn.commit()
                cur.execute(
                    "INSERT INTO user_activity_log (user_id, action, details) VALUES (%s, %s, %s)",
                    (admin_id, "admin_reset_password", f"Сброс пароля для user_id={user_id}")
                )
                conn.commit()
                return ok({"ok": True, "new_password": new_pass})
            elif action == "logout":
                cur.execute("UPDATE user_sessions SET expires_at = NOW() WHERE user_id = %s", (user_id,))

            cur.execute(
                "INSERT INTO user_activity_log (user_id, action, details) VALUES (%s, %s, %s)",
                (admin_id, f"admin_{action}", f"user_id={user_id}")
            )
            conn.commit()
            return ok({"ok": True})

        # --- ACTIVITY LOG ---
        elif "/activity" in path:
            limit = int(qs.get("limit", 100))
            cur.execute(
                "SELECT l.id, l.user_id, u.email, l.action, l.details, l.ip_address, l.created_at FROM user_activity_log l LEFT JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC LIMIT %s",
                (limit,)
            )
            rows = cur.fetchall()
            logs = [{"id": r[0], "user_id": r[1], "email": r[2], "action": r[3], "details": r[4], "ip": r[5], "created_at": str(r[6])} for r in rows]
            return ok({"logs": logs})

        # --- TICKETS LIST ---
        elif "/tickets" in path and method == "GET":
            status_filter = qs.get("status", "")
            where = ["1=1"]
            params = []
            if status_filter:
                where.append("t.status = %s"); params.append(status_filter)
            cur.execute(
                f"SELECT t.id, t.subject, t.status, t.priority, t.created_at, u.email FROM support_tickets t LEFT JOIN users u ON t.user_id = u.id WHERE {' AND '.join(where)} ORDER BY t.created_at DESC LIMIT 100",
                params
            )
            rows = cur.fetchall()
            tickets = [{"id": r[0], "subject": r[1], "status": r[2], "priority": r[3], "created_at": str(r[4]), "user_email": r[5]} for r in rows]
            return ok({"tickets": tickets})

        # --- TICKET UPDATE ---
        elif "/tickets" in path and method == "POST":
            ticket_id = body.get("ticket_id")
            action = body.get("action")
            if action == "close":
                cur.execute("UPDATE support_tickets SET status = 'closed', updated_at = NOW() WHERE id = %s", (ticket_id,))
            elif action == "reply":
                reply_body = body.get("body", "")
                cur.execute(
                    "INSERT INTO ticket_messages (ticket_id, user_id, body, is_internal) VALUES (%s, %s, %s, %s)",
                    (ticket_id, admin_id, reply_body, body.get("is_internal", False))
                )
                cur.execute("UPDATE support_tickets SET status = 'in_progress', updated_at = NOW() WHERE id = %s", (ticket_id,))
            elif action == "assign":
                cur.execute("UPDATE support_tickets SET assigned_to = %s, updated_at = NOW() WHERE id = %s", (body.get("assign_to"), ticket_id))
            conn.commit()
            return ok({"ok": True})

        # --- SUBSCRIPTIONS ---
        elif "/subscriptions" in path and method == "GET":
            cur.execute(
                "SELECT id, email, name, subscription, subscription_expires_at, status FROM users ORDER BY created_at DESC LIMIT 200"
            )
            rows = cur.fetchall()
            subs = [{"id": r[0], "email": r[1], "name": r[2], "subscription": r[3], "expires_at": str(r[4]) if r[4] else None, "status": r[5]} for r in rows]
            return ok({"subscriptions": subs})

        elif "/subscriptions" in path and method == "POST":
            user_id = body.get("user_id")
            plan = body.get("plan", "free")
            days = int(body.get("days", 30))
            expires = datetime.utcnow() + timedelta(days=days)
            cur.execute(
                "UPDATE users SET subscription = %s, subscription_expires_at = %s WHERE id = %s",
                (plan, expires, user_id)
            )
            conn.commit()
            return ok({"ok": True})

        # --- ORDERS/FINANCE ---
        elif "/finance" in path:
            cur.execute(
                "SELECT o.id, o.order_number, o.user_name, o.user_email, o.amount, o.status, o.created_at, o.paid_at FROM orders o ORDER BY o.created_at DESC LIMIT 200"
            )
            rows = cur.fetchall()
            orders = [{"id": r[0], "order_number": r[1], "user_name": r[2], "user_email": r[3], "amount": float(r[4]), "status": r[5], "created_at": str(r[6]), "paid_at": str(r[7]) if r[7] else None} for r in rows]
            return ok({"orders": orders})

        else:
            return err("Маршрут не найден", 404)

    finally:
        cur.close()
        conn.close()
