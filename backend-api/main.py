"""
ApprovalHub FastAPI Backend
シンプルで高速なREST API
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
from jose import JWTError, jwt
from passlib.context import CryptContext
from urllib.parse import urlparse
import socket

# 環境変数読み込み
load_dotenv()

# FastAPIアプリ
app = FastAPI(
    title="ApprovalHub API",
    description="ワークフロー承認システム",
    version="1.0.0"
)

# CORS設定
# Vercel と localhost からのリクエストを許可
ALLOWED_ORIGINS = [
    "https://approvalhub.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

print(f"[CORS] Allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# セキュリティ
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT設定
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# データベース接続（IPv4を強制）
def get_db():
    database_url = os.getenv("DATABASE_URL")

    # URLをパース
    parsed = urlparse(database_url)

    # 接続パラメータを構築（sslmode=requireを追加してIPv6問題を回避）
    conn_params = {
        "host": parsed.hostname,
        "port": parsed.port or 5432,
        "database": parsed.path.lstrip('/'),
        "user": parsed.username,
        "password": parsed.password,
        "cursor_factory": RealDictCursor,
        "sslmode": "require",
        "connect_timeout": 10
    }

    # IPv4を強制するためにoptions設定を追加
    # Supabaseは常にIPv4アドレスも提供しているので、
    # gethostbyname()でIPv4アドレスを取得
    try:
        # IPv4アドレスのみを取得
        import socket
        ipv4_addr = socket.gethostbyname(parsed.hostname)
        conn_params["host"] = ipv4_addr
    except Exception as e:
        # DNS解決失敗時はホスト名をそのまま使用
        print(f"Failed to resolve IPv4 address: {e}")
        pass

    conn = psycopg2.connect(**conn_params)
    try:
        yield conn
    finally:
        conn.close()

# Pydanticモデル
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

class User(BaseModel):
    id: int
    name: str
    email: str
    role: str

class Approval(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    applicant_id: int
    current_step: int
    created_at: datetime

# JWT関数
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

# ルート
@app.get("/")
def read_root():
    return {
        "message": "ApprovalHub API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest, conn=Depends(get_db)):
    """ログイン"""
    cursor = conn.cursor()

    # ユーザー検索
    cursor.execute(
        "SELECT * FROM users WHERE email = %s AND deleted_at IS NULL",
        (request.email,)
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません"
        )

    # パスワード検証（bcryptハッシュ）
    # サンプルデータのパスワードは 'password'
    # 実際のbcryptハッシュと照合
    if not pwd_context.verify(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません"
        )

    # JWT生成
    token = create_access_token({
        "user_id": user["id"],
        "email": user["email"],
        "tenant_id": user["tenant_id"]
    })

    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@app.get("/api/approvals", response_model=List[dict])
def get_approvals(
    status: Optional[str] = None,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認一覧取得"""
    print(f"[DEBUG] get_approvals called - tenant_id: {payload.get('tenant_id')}, user_id: {payload.get('user_id')}")

    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")

    # RLS設定
    print(f"[DEBUG] Setting RLS tenant_id: {tenant_id}")
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # 承認一覧取得
    print(f"[DEBUG] Executing query for tenant_id: {tenant_id}")
    query = """
        SELECT
            a.*,
            u.name as applicant_name,
            r.name as route_name
        FROM approvals a
        INNER JOIN users u ON a.applicant_id = u.id
        INNER JOIN approval_routes r ON a.route_id = r.id
        WHERE a.tenant_id = %s
    """
    params = [tenant_id]

    if status:
        query += " AND a.status = %s"
        params.append(status)

    query += " ORDER BY a.created_at DESC LIMIT 100"

    cursor.execute(query, params)
    print(f"[DEBUG] Query executed, fetching results...")
    approvals = cursor.fetchall()
    print(f"[DEBUG] Found {len(approvals)} approvals")

    return approvals

class CreateApprovalRequest(BaseModel):
    title: str
    description: Optional[str] = None
    route_id: int

@app.post("/api/approvals")
def create_approval(
    request_body: CreateApprovalRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """新規承認申請を作成"""
    print(f"[DEBUG] create_approval called - title: {request_body.title}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # 承認ルートの存在確認
    cursor.execute(
        "SELECT * FROM approval_routes WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (request_body.route_id, tenant_id)
    )
    route = cursor.fetchone()

    if not route:
        raise HTTPException(status_code=404, detail="Approval route not found")

    # 新規承認申請を作成
    cursor.execute(
        """
        INSERT INTO approvals (
            tenant_id, route_id, applicant_id, title, description,
            status, current_step, created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, 'pending', 1, NOW(), NOW())
        RETURNING id
        """,
        (tenant_id, request_body.route_id, user_id, request_body.title, request_body.description)
    )

    result = cursor.fetchone()
    approval_id = result["id"]

    conn.commit()

    print(f"[DEBUG] Created approval: {approval_id}")

    return {
        "success": True,
        "message": "承認申請を作成しました",
        "approval_id": approval_id
    }

@app.get("/api/approval-routes")
def get_approval_routes(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認ルート一覧取得（承認者情報含む）"""
    print(f"[DEBUG] get_approval_routes called")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # 承認ルート一覧を取得
    cursor.execute(
        """
        SELECT
            ar.id,
            ar.name,
            ar.description,
            ar.is_active,
            ar.created_at
        FROM approval_routes ar
        WHERE ar.tenant_id = %s AND ar.deleted_at IS NULL AND ar.is_active = TRUE
        ORDER BY ar.created_at DESC
        """,
        (tenant_id,)
    )

    routes = cursor.fetchall()
    print(f"[DEBUG] Found {len(routes)} approval routes")

    # 各ルートのステップ情報を取得
    result = []
    for route in routes:
        cursor.execute(
            """
            SELECT
                ars.step_order,
                ars.approver_id,
                u.name as approver_name,
                ars.is_required
            FROM approval_route_steps ars
            LEFT JOIN users u ON ars.approver_id = u.id
            WHERE ars.route_id = %s
            ORDER BY ars.step_order ASC
            """,
            (route["id"],)
        )
        steps = cursor.fetchall()

        route_dict = dict(route)
        route_dict["step_count"] = len(steps)
        route_dict["steps"] = [dict(step) for step in steps]
        result.append(route_dict)

    return result

@app.get("/api/approvals/{approval_id}")
def get_approval_by_id(
    approval_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認詳細取得"""
    print(f"[DEBUG] get_approval_by_id called - approval_id: {approval_id}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # 承認詳細取得（承認履歴も含む）
    query = """
        SELECT
            a.*,
            u.name as applicant_name,
            r.name as route_name
        FROM approvals a
        INNER JOIN users u ON a.applicant_id = u.id
        INNER JOIN approval_routes r ON a.route_id = r.id
        WHERE a.id = %s AND a.tenant_id = %s
    """

    cursor.execute(query, (approval_id, tenant_id))
    approval = cursor.fetchone()

    if not approval:
        print(f"[DEBUG] Approval {approval_id} not found for tenant {tenant_id}")
        raise HTTPException(status_code=404, detail="Approval not found")

    print(f"[DEBUG] Found approval: {approval_id}, fetching histories...")

    # 承認履歴を取得
    try:
        cursor.execute(
            """
            SELECT
                ah.*,
                u.name as approver_name
            FROM approval_histories ah
            LEFT JOIN users u ON ah.user_id = u.id
            WHERE ah.approval_id = %s
            ORDER BY ah.created_at ASC
            LIMIT 100
            """,
            (approval_id,)
        )
        histories = cursor.fetchall()
        print(f"[DEBUG] Found {len(histories)} histories")
    except Exception as e:
        print(f"[DEBUG] Error fetching histories: {e}")
        histories = []

    # フロントエンドが期待する形式に変換
    result = dict(approval)

    # applicant オブジェクトを作成
    result['applicant'] = {
        'id': result.get('applicant_id'),
        'name': result.get('applicant_name')
    }

    # historiesを変換（user オブジェクトを含む形式に）
    formatted_histories = []
    for h in histories:
        history_dict = dict(h)
        history_dict['user'] = {
            'name': history_dict.get('approver_name', 'システム')
        }
        formatted_histories.append(history_dict)

    result['histories'] = formatted_histories

    # total_steps を追加（route情報から取得する必要があるが、とりあえず仮の値）
    result['total_steps'] = result.get('total_steps', 3)

    print(f"[DEBUG] Returning approval data for: {approval_id}")
    return result

class ApprovalActionRequest(BaseModel):
    comment: Optional[str] = None

@app.post("/api/approvals/{approval_id}/approve")
def approve_approval(
    approval_id: int,
    request_body: ApprovalActionRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認を実行"""
    print(f"[DEBUG] approve_approval called - approval_id: {approval_id}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # 承認情報を取得
    cursor.execute(
        "SELECT * FROM approvals WHERE id = %s AND tenant_id = %s",
        (approval_id, tenant_id)
    )
    approval = cursor.fetchone()

    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")

    if approval["status"] != "pending":
        raise HTTPException(status_code=400, detail="This approval is not pending")

    # 自己承認チェック
    if approval["applicant_id"] == user_id:
        raise HTTPException(status_code=403, detail="Cannot approve your own request")

    # 承認履歴を追加
    cursor.execute(
        """
        INSERT INTO approval_histories (approval_id, step_order, user_id, action, comment, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """,
        (approval_id, approval["current_step"], user_id, "approved", request_body.comment or "承認しました")
    )

    # current_stepを更新
    new_step = approval["current_step"] + 1

    # 最終ステップの場合はstatusをapprovedに
    # とりあえず3ステップと仮定
    if new_step > 3:
        cursor.execute(
            """
            UPDATE approvals
            SET status = 'approved', current_step = %s, updated_at = NOW()
            WHERE id = %s
            """,
            (new_step, approval_id)
        )
        final_status = "approved"
    else:
        cursor.execute(
            """
            UPDATE approvals
            SET current_step = %s, updated_at = NOW()
            WHERE id = %s
            """,
            (new_step, approval_id)
        )
        final_status = "pending"

    conn.commit()

    print(f"[DEBUG] Approval {approval_id} approved by user {user_id}")

    return {
        "success": True,
        "message": "承認しました",
        "approval_id": approval_id,
        "new_status": final_status,
        "current_step": new_step
    }

@app.post("/api/approvals/{approval_id}/reject")
def reject_approval(
    approval_id: int,
    request_body: ApprovalActionRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認を差し戻し"""
    print(f"[DEBUG] reject_approval called - approval_id: {approval_id}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # 承認情報を取得
    cursor.execute(
        "SELECT * FROM approvals WHERE id = %s AND tenant_id = %s",
        (approval_id, tenant_id)
    )
    approval = cursor.fetchone()

    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")

    if approval["status"] != "pending":
        raise HTTPException(status_code=400, detail="This approval is not pending")

    # 自己差し戻しチェック
    if approval["applicant_id"] == user_id:
        raise HTTPException(status_code=403, detail="Cannot reject your own request")

    # 承認履歴を追加
    cursor.execute(
        """
        INSERT INTO approval_histories (approval_id, step_order, user_id, action, comment, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """,
        (approval_id, approval["current_step"], user_id, "rejected", request_body.comment or "差し戻しました")
    )

    # ステータスをrejectedに更新
    cursor.execute(
        """
        UPDATE approvals
        SET status = 'rejected', updated_at = NOW()
        WHERE id = %s
        """,
        (approval_id,)
    )

    conn.commit()

    print(f"[DEBUG] Approval {approval_id} rejected by user {user_id}")

    return {
        "success": True,
        "message": "差し戻しました",
        "approval_id": approval_id,
        "new_status": "rejected"
    }

@app.get("/api/users", response_model=List[User])
def get_users(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ユーザー一覧取得"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    cursor.execute(
        "SELECT id, name, email, role FROM users WHERE tenant_id = %s AND deleted_at IS NULL",
        (tenant_id,)
    )
    users = cursor.fetchall()

    return users

@app.get("/api/notifications")
def get_notifications(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """通知一覧取得"""
    cursor = conn.cursor()

    user_id = payload.get("user_id")

    cursor.execute(
        """
        SELECT * FROM notifications
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 50
        """,
        (user_id,)
    )
    notifications = cursor.fetchall()

    return notifications

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
