"""
Admin API: управление пользователями, статистика, тикеты, контент, настройки.
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


def q(table: str) -> str:
    return f'"{SCHEMA}".{table}'


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
        f"SELECT u.id, u.role FROM {q('user_sessions')} s JOIN {q('users')} u ON s.user_id = u.id WHERE s.token = %s AND s.expires_at > NOW()",
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
        return {"statusCode": 200, "headers": cors_headers(), "body": "", "isBase64Encoded": False}

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

    try:
        admin_id = check_admin(event, cur)
        if not admin_id:
            return err("Доступ запрещён — требуются права администратора", 403)

        # --- DASHBOARD STATS ---
        if "/stats" in path:
            cur.execute(f"SELECT COUNT(*) FROM {q('users')}")
            total_users = cur.fetchone()[0]

            cur.execute(f"SELECT COUNT(*) FROM {q('users')} WHERE created_at > NOW() - INTERVAL '1 day'")
            new_today = cur.fetchone()[0]

            cur.execute(f"SELECT COUNT(*) FROM {q('users')} WHERE created_at > NOW() - INTERVAL '7 days'")
            new_week = cur.fetchone()[0]

            cur.execute(f"SELECT COUNT(*) FROM {q('users')} WHERE created_at > NOW() - INTERVAL '30 days'")
            new_month = cur.fetchone()[0]

            cur.execute(f"SELECT COUNT(*) FROM {q('users')} WHERE last_login_at > NOW() - INTERVAL '1 hour'")
            online_now = cur.fetchone()[0]

            cur.execute(f"SELECT COUNT(*) FROM {q('orders')} WHERE status = 'paid'")
            paid_orders = cur.fetchone()[0]

            cur.execute(f"SELECT COALESCE(SUM(amount), 0) FROM {q('orders')} WHERE status = 'paid'")
            total_revenue = float(cur.fetchone()[0])

            cur.execute(f"SELECT COUNT(*) FROM {q('orders')} WHERE status = 'paid' AND created_at > NOW() - INTERVAL '30 days'")
            revenue_month_count = cur.fetchone()[0]

            cur.execute(f"SELECT COALESCE(SUM(amount), 0) FROM {q('orders')} WHERE status = 'paid' AND created_at > NOW() - INTERVAL '30 days'")
            revenue_month = float(cur.fetchone()[0])

            cur.execute(f"SELECT COUNT(*) FROM {q('support_tickets')} WHERE status = 'new'")
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
        elif "/users" in path and method == "GET":
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
                f"SELECT id, email, name, role, status, subscription, last_login_at, created_at FROM {q('users')} WHERE {where_sql} ORDER BY created_at DESC LIMIT %s OFFSET %s",
                params + [limit, offset]
            )
            rows = cur.fetchall()
            cur.execute(f"SELECT COUNT(*) FROM {q('users')} WHERE {where_sql}", params)
            total = cur.fetchone()[0]

            users = [{"id": r[0], "email": r[1], "name": r[2], "role": r[3], "status": r[4], "subscription": r[5], "last_login_at": str(r[6]) if r[6] else None, "created_at": str(r[7])} for r in rows]
            return ok({"users": users, "total": total})

        # --- USER ACTION (block/unblock/role/reset/logout) ---
        elif "/user-action" in path and method == "POST":
            user_id = body.get("user_id")
            action = body.get("action")

            if action == "block":
                cur.execute(f"UPDATE {q('users')} SET status = 'blocked' WHERE id = %s", (user_id,))
                cur.execute(f"UPDATE {q('user_sessions')} SET expires_at = NOW() WHERE user_id = %s", (user_id,))
            elif action == "unblock":
                cur.execute(f"UPDATE {q('users')} SET status = 'active' WHERE id = %s", (user_id,))
            elif action == "set_role":
                new_role = body.get("role", "user")
                cur.execute(f"UPDATE {q('users')} SET role = %s WHERE id = %s", (new_role, user_id))
            elif action == "reset_password":
                new_pass = secrets.token_urlsafe(10)
                salt = secrets.token_hex(16)
                hashed = hmac.new(salt.encode(), new_pass.encode(), hashlib.sha256).hexdigest()
                pw_hash = f"{salt}:{hashed}"
                cur.execute(f"UPDATE {q('users')} SET password_hash = %s WHERE id = %s", (pw_hash, user_id))
                cur.execute(
                    f"INSERT INTO {q('user_activity_log')} (user_id, action, details) VALUES (%s, %s, %s)",
                    (admin_id, "admin_reset_password", f"Сброс пароля для user_id={user_id}")
                )
                conn.commit()
                return ok({"ok": True, "new_password": new_pass})
            elif action == "force_logout":
                cur.execute(f"UPDATE {q('user_sessions')} SET expires_at = NOW() WHERE user_id = %s", (user_id,))

            cur.execute(
                f"INSERT INTO {q('user_activity_log')} (user_id, action, details) VALUES (%s, %s, %s)",
                (admin_id, f"admin_{action}", f"user_id={user_id}")
            )
            conn.commit()
            return ok({"ok": True})

        # --- ACTIVITY LOG ---
        elif "/activity" in path:
            limit = int(qs.get("limit", 100))
            cur.execute(
                f"SELECT l.id, l.user_id, u.email, l.action, l.details, l.ip_address, l.created_at FROM {q('user_activity_log')} l LEFT JOIN {q('users')} u ON l.user_id = u.id ORDER BY l.created_at DESC LIMIT %s",
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
                f"SELECT t.id, t.subject, t.status, t.priority, t.created_at, u.email FROM {q('support_tickets')} t LEFT JOIN {q('users')} u ON t.user_id = u.id WHERE {' AND '.join(where)} ORDER BY t.created_at DESC LIMIT 100",
                params
            )
            rows = cur.fetchall()
            tickets = [{"id": r[0], "subject": r[1], "status": r[2], "priority": r[3], "created_at": str(r[4]), "user_email": r[5]} for r in rows]
            return ok({"tickets": tickets})

        # --- TICKET UPDATE ---
        elif "/ticket-action" in path and method == "POST":
            ticket_id = body.get("ticket_id")
            action = body.get("action")
            if action == "close":
                cur.execute(f"UPDATE {q('support_tickets')} SET status = 'closed', updated_at = NOW() WHERE id = %s", (ticket_id,))
            elif action == "reply":
                reply_body = body.get("body", "")
                cur.execute(
                    f"INSERT INTO {q('ticket_messages')} (ticket_id, user_id, body) VALUES (%s, %s, %s)",
                    (ticket_id, admin_id, reply_body)
                )
                cur.execute(f"UPDATE {q('support_tickets')} SET status = 'in_progress', updated_at = NOW() WHERE id = %s", (ticket_id,))
            elif action == "assign":
                cur.execute(f"UPDATE {q('support_tickets')} SET assigned_to = %s, updated_at = NOW() WHERE id = %s", (body.get("assign_to"), ticket_id))
            conn.commit()
            return ok({"ok": True})

        # --- SUBSCRIPTIONS ---
        elif "/subscriptions" in path and method == "GET":
            cur.execute(
                f"SELECT id, email, name, subscription, subscription_expires_at, status FROM {q('users')} ORDER BY created_at DESC LIMIT 200"
            )
            rows = cur.fetchall()
            subs = [{"id": r[0], "email": r[1], "name": r[2], "subscription": r[3], "expires_at": str(r[4]) if r[4] else None, "status": r[5]} for r in rows]
            return ok({"subscriptions": subs})

        # --- SUBSCRIPTION UPDATE ---
        elif "/subscription-action" in path and method == "POST":
            user_id = body.get("user_id")
            sub_type = body.get("subscription", "free")
            days = int(body.get("days", 30))
            expires = datetime.utcnow() + timedelta(days=days)
            cur.execute(
                f"UPDATE {q('users')} SET subscription = %s, subscription_expires_at = %s WHERE id = %s",
                (sub_type, expires, user_id)
            )
            cur.execute(
                f"INSERT INTO {q('user_activity_log')} (user_id, action, details) VALUES (%s, %s, %s)",
                (admin_id, "admin_set_subscription", f"user_id={user_id} sub={sub_type} days={days}")
            )
            conn.commit()
            return ok({"ok": True})

        # --- FINANCE ---
        elif "/finance" in path:
            cur.execute(
                f"SELECT order_number, user_name, user_email, amount, status, created_at FROM {q('orders')} ORDER BY created_at DESC LIMIT 200"
            )
            rows = cur.fetchall()
            orders = [{"order_number": r[0], "user_name": r[1], "user_email": r[2], "amount": float(r[3]), "status": r[4], "created_at": str(r[5])} for r in rows]

            cur.execute(f"SELECT COALESCE(SUM(amount),0) FROM {q('orders')} WHERE status='paid' AND created_at > NOW() - INTERVAL '1 day'")
            rev_day = float(cur.fetchone()[0])
            cur.execute(f"SELECT COALESCE(SUM(amount),0) FROM {q('orders')} WHERE status='paid' AND created_at > NOW() - INTERVAL '7 days'")
            rev_week = float(cur.fetchone()[0])
            cur.execute(f"SELECT COALESCE(SUM(amount),0) FROM {q('orders')} WHERE status='paid' AND created_at > NOW() - INTERVAL '30 days'")
            rev_month = float(cur.fetchone()[0])

            return ok({"orders": orders, "revenue_day": rev_day, "revenue_week": rev_week, "revenue_month": rev_month})

        else:
            return err("Маршрут не найден", 404)

    finally:
        cur.close()
        conn.close()
