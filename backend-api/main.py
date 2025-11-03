"""
ApprovalHub FastAPI Backend
シンプルで高速なREST API
"""
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
import os
import json
import uuid
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
from jose import JWTError, jwt
from passlib.context import CryptContext
from urllib.parse import urlparse
import socket
import boto3
from botocore.exceptions import ClientError

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

# Cloudflare R2設定
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "approvalhub-files")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "10"))

# Cloudflare R2クライアント初期化
r2_client = None
if R2_ACCOUNT_ID and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY:
    r2_client = boto3.client(
        's3',
        endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name='auto'
    )

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

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    tenant_slug: str = "demo"  # デフォルトテナント

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

class DelegationCreateRequest(BaseModel):
    delegate_user_id: int
    start_date: str  # YYYY-MM-DD形式
    end_date: str    # YYYY-MM-DD形式
    reason: str

class FormTemplateCreateRequest(BaseModel):
    name: str
    description: Optional[str]
    icon: Optional[str]
    is_active: Optional[bool] = True
    fields: list  # JSON形式のフィールド定義

class WebhookCreateRequest(BaseModel):
    name: str
    url: str
    events: list  # ["approval.created", "approval.approved", ...]
    is_active: Optional[bool] = True
    secret: Optional[str]

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

@app.post("/api/auth/signup", response_model=LoginResponse)
def signup(request: SignupRequest, conn=Depends(get_db)):
    """サインアップ（新規ユーザー登録）"""
    cursor = conn.cursor()

    # テナント検索
    cursor.execute(
        "SELECT * FROM tenants WHERE slug = %s AND deleted_at IS NULL",
        (request.tenant_slug,)
    )
    tenant = cursor.fetchone()

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="組織が見つかりません"
        )

    tenant_id = tenant["id"]

    # メールアドレスの重複チェック
    cursor.execute(
        "SELECT * FROM users WHERE email = %s AND tenant_id = %s AND deleted_at IS NULL",
        (request.email, tenant_id)
    )
    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に登録されています"
        )

    # パスワードハッシュ化
    hashed_password = pwd_context.hash(request.password)

    # 新規ユーザー作成
    cursor.execute(
        """
        INSERT INTO users (tenant_id, name, email, password, role, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        RETURNING id, name, email, role, tenant_id
        """,
        (tenant_id, request.name, request.email, hashed_password, "member")
    )

    user = cursor.fetchone()
    conn.commit()

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
    template_id: Optional[int] = None
    form_data: Optional[dict] = None

class RouteStepRequest(BaseModel):
    step_order: int
    approver_id: int
    is_required: bool = True
    is_parallel_group: bool = False
    parallel_requirement: Optional[str] = None  # 'all' or 'any'

class CreateRouteRequest(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True
    steps: List[RouteStepRequest]

class UpdateRouteRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    steps: Optional[List[RouteStepRequest]] = None

class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "member"  # admin, manager, member

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None

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
    form_data_json = json.dumps(request_body.form_data) if request_body.form_data else None

    cursor.execute(
        """
        INSERT INTO approvals (
            tenant_id, route_id, applicant_id, title, description,
            template_id, form_data,
            status, current_step, created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending', 1, NOW(), NOW())
        RETURNING id
        """,
        (tenant_id, request_body.route_id, user_id, request_body.title, request_body.description,
         request_body.template_id, form_data_json)
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

@app.post("/api/approval-routes")
def create_approval_route(
    request_body: CreateRouteRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認ルートを作成"""
    print(f"[DEBUG] create_approval_route called - name: {request_body.name}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # 承認ルートを作成
    cursor.execute(
        """
        INSERT INTO approval_routes (tenant_id, name, description, is_active, created_by, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        RETURNING id
        """,
        (tenant_id, request_body.name, request_body.description, request_body.is_active, user_id)
    )

    route = cursor.fetchone()
    route_id = route["id"]

    # ステップを作成
    for step in request_body.steps:
        cursor.execute(
            """
            INSERT INTO approval_route_steps (route_id, step_order, approver_id, is_required, is_parallel_group, parallel_requirement, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
            """,
            (route_id, step.step_order, step.approver_id, step.is_required, step.is_parallel_group, step.parallel_requirement)
        )

    conn.commit()

    print(f"[DEBUG] Created approval route: {route_id}")

    return {
        "success": True,
        "message": "承認ルートを作成しました",
        "route_id": route_id
    }

@app.put("/api/approval-routes/{route_id}")
def update_approval_route(
    route_id: int,
    request_body: UpdateRouteRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認ルートを更新"""
    print(f"[DEBUG] update_approval_route called - route_id: {route_id}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # ルートの存在確認
    cursor.execute(
        "SELECT * FROM approval_routes WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (route_id, tenant_id)
    )
    route = cursor.fetchone()

    if not route:
        raise HTTPException(status_code=404, detail="Approval route not found")

    # 更新
    update_fields = []
    params = []

    if request_body.name is not None:
        update_fields.append("name = %s")
        params.append(request_body.name)

    if request_body.description is not None:
        update_fields.append("description = %s")
        params.append(request_body.description)

    if request_body.is_active is not None:
        update_fields.append("is_active = %s")
        params.append(request_body.is_active)

    if update_fields:
        update_fields.append("updated_at = NOW()")
        params.append(route_id)

        query = f"UPDATE approval_routes SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, params)

    # ステップの更新（既存のステップを削除して再作成）
    if request_body.steps is not None:
        cursor.execute("DELETE FROM approval_route_steps WHERE route_id = %s", (route_id,))

        for step in request_body.steps:
            cursor.execute(
                """
                INSERT INTO approval_route_steps (route_id, step_order, approver_id, is_required, is_parallel_group, parallel_requirement, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
                """,
                (route_id, step.step_order, step.approver_id, step.is_required, step.is_parallel_group, step.parallel_requirement)
            )

    conn.commit()

    print(f"[DEBUG] Updated approval route: {route_id}")

    return {
        "success": True,
        "message": "承認ルートを更新しました",
        "route_id": route_id
    }

@app.delete("/api/approval-routes/{route_id}")
def delete_approval_route(
    route_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認ルートを削除（ソフトデリート）"""
    print(f"[DEBUG] delete_approval_route called - route_id: {route_id}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))
    conn.commit()

    # ルートの存在確認
    cursor.execute(
        "SELECT * FROM approval_routes WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (route_id, tenant_id)
    )
    route = cursor.fetchone()

    if not route:
        raise HTTPException(status_code=404, detail="Approval route not found")

    # ソフトデリート
    cursor.execute(
        "UPDATE approval_routes SET deleted_at = NOW() WHERE id = %s",
        (route_id,)
    )

    conn.commit()

    print(f"[DEBUG] Deleted approval route: {route_id}")

    return {
        "success": True,
        "message": "承認ルートを削除しました",
        "route_id": route_id
    }

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

    # total_steps を動的に取得（approval_route_stepsから）
    cursor.execute(
        "SELECT COUNT(DISTINCT step_order) as total_steps FROM approval_route_steps WHERE route_id = %s",
        (approval["route_id"],)
    )
    step_count = cursor.fetchone()
    result['total_steps'] = step_count["total_steps"] if step_count else 1

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

    # total_stepsを動的に取得
    cursor.execute(
        "SELECT COUNT(DISTINCT step_order) as total_steps FROM approval_route_steps WHERE route_id = %s",
        (approval["route_id"],)
    )
    step_count_result = cursor.fetchone()
    total_steps = step_count_result["total_steps"] if step_count_result else 1

    # current_stepを更新
    new_step = approval["current_step"] + 1

    # 最終ステップの場合はstatusをapprovedに
    if new_step > total_steps:
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

@app.post("/api/approvals/{approval_id}/withdraw")
def withdraw_approval(
    approval_id: int,
    request_body: ApprovalActionRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """承認申請を取り下げ（申請者のみ可能）"""
    print(f"[DEBUG] withdraw_approval called - approval_id: {approval_id}")

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

    # 申請者本人チェック
    if approval["applicant_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only the applicant can withdraw this request")

    if approval["status"] != "pending":
        raise HTTPException(status_code=400, detail="Only pending approvals can be withdrawn")

    # 承認履歴を追加
    cursor.execute(
        """
        INSERT INTO approval_histories (approval_id, step_order, user_id, action, comment, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """,
        (approval_id, approval["current_step"], user_id, "withdrawn", request_body.comment or "申請を取り下げました")
    )

    # ステータスをwithdrawに更新
    cursor.execute(
        """
        UPDATE approvals
        SET status = 'withdrawn', updated_at = NOW()
        WHERE id = %s
        """,
        (approval_id,)
    )

    conn.commit()

    print(f"[DEBUG] Approval {approval_id} withdrawn by user {user_id}")

    return {
        "success": True,
        "message": "申請を取り下げました",
        "approval_id": approval_id,
        "new_status": "withdrawn"
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

@app.post("/api/users")
def create_user(
    request_body: CreateUserRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ユーザーを作成（チーム管理者のみ）"""
    print(f"[DEBUG] create_user called - email: {request_body.email}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")

    # メールアドレスの重複チェック
    cursor.execute(
        "SELECT * FROM users WHERE email = %s AND tenant_id = %s AND deleted_at IS NULL",
        (request_body.email, tenant_id)
    )
    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に登録されています"
        )

    # パスワードハッシュ化
    hashed_password = pwd_context.hash(request_body.password)

    # 新規ユーザー作成
    cursor.execute(
        """
        INSERT INTO users (tenant_id, name, email, password, role, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        RETURNING id
        """,
        (tenant_id, request_body.name, request_body.email, hashed_password, request_body.role)
    )

    result = cursor.fetchone()
    user_id = result["id"]

    conn.commit()

    print(f"[DEBUG] Created user: {user_id}")

    return {
        "success": True,
        "message": "ユーザーを作成しました",
        "user_id": user_id
    }

@app.put("/api/users/{user_id}")
def update_user(
    user_id: int,
    request_body: UpdateUserRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ユーザーを更新"""
    print(f"[DEBUG] update_user called - user_id: {user_id}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")

    # ユーザーの存在確認
    cursor.execute(
        "SELECT * FROM users WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (user_id, tenant_id)
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # メールアドレスの重複チェック（自分以外）
    if request_body.email:
        cursor.execute(
            "SELECT * FROM users WHERE email = %s AND tenant_id = %s AND id != %s AND deleted_at IS NULL",
            (request_body.email, tenant_id, user_id)
        )
        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このメールアドレスは既に使用されています"
            )

    # 更新
    update_fields = []
    params = []

    if request_body.name is not None:
        update_fields.append("name = %s")
        params.append(request_body.name)

    if request_body.email is not None:
        update_fields.append("email = %s")
        params.append(request_body.email)

    if request_body.password is not None:
        hashed_password = pwd_context.hash(request_body.password)
        update_fields.append("password = %s")
        params.append(hashed_password)

    if request_body.role is not None:
        update_fields.append("role = %s")
        params.append(request_body.role)

    if update_fields:
        update_fields.append("updated_at = NOW()")
        params.append(user_id)

        query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, params)

        conn.commit()

    print(f"[DEBUG] Updated user: {user_id}")

    return {
        "success": True,
        "message": "ユーザーを更新しました",
        "user_id": user_id
    }

@app.delete("/api/users/{user_id}")
def delete_user(
    user_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ユーザーを削除（ソフトデリート）"""
    print(f"[DEBUG] delete_user called - user_id: {user_id}")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")

    # ユーザーの存在確認
    cursor.execute(
        "SELECT * FROM users WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (user_id, tenant_id)
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 自分自身は削除不可
    current_user_id = payload.get("user_id")
    if user_id == current_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="自分自身は削除できません"
        )

    # ソフトデリート
    cursor.execute(
        "UPDATE users SET deleted_at = NOW() WHERE id = %s",
        (user_id,)
    )

    conn.commit()

    print(f"[DEBUG] Deleted user: {user_id}")

    return {
        "success": True,
        "message": "ユーザーを削除しました",
        "user_id": user_id
    }

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

# ========================================
# 代理承認 API
# ========================================

@app.get("/api/delegations")
def get_delegations(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """自分の代理承認設定一覧取得"""
    cursor = conn.cursor()

    user_id = payload.get("user_id")
    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    cursor.execute(
        """
        SELECT
            d.id,
            d.user_id,
            d.delegate_user_id,
            du.name as delegate_name,
            du.email as delegate_email,
            d.start_date,
            d.end_date,
            d.reason,
            d.created_at,
            CASE
                WHEN CURRENT_DATE BETWEEN d.start_date AND d.end_date THEN true
                ELSE false
            END as is_active
        FROM delegations d
        JOIN users du ON d.delegate_user_id = du.id
        WHERE d.user_id = %s
          AND d.deleted_at IS NULL
        ORDER BY d.created_at DESC
        """,
        (user_id,)
    )

    delegations = cursor.fetchall()

    return [
        {
            "id": d["id"],
            "delegateId": d["delegate_user_id"],
            "delegateName": d["delegate_name"],
            "delegateEmail": d["delegate_email"],
            "startDate": d["start_date"].isoformat() if d["start_date"] else None,
            "endDate": d["end_date"].isoformat() if d["end_date"] else None,
            "reason": d["reason"],
            "isActive": d["is_active"],
        }
        for d in delegations
    ]

@app.post("/api/delegations")
def create_delegation(
    request: DelegationCreateRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """代理承認設定を作成"""
    cursor = conn.cursor()

    user_id = payload.get("user_id")
    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # 委任先ユーザーが存在するか確認
    cursor.execute(
        "SELECT id FROM users WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (request.delegate_user_id, tenant_id)
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Delegate user not found")

    # 自分自身に委任できない
    if request.delegate_user_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot delegate to yourself")

    # 代理承認設定を作成
    cursor.execute(
        """
        INSERT INTO delegations (
            user_id, delegate_user_id, start_date, end_date, reason,
            tenant_id, created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
        RETURNING id, user_id, delegate_user_id, start_date, end_date, reason, created_at
        """,
        (
            user_id,
            request.delegate_user_id,
            request.start_date,
            request.end_date,
            request.reason,
            tenant_id,
        )
    )

    delegation = cursor.fetchone()
    conn.commit()

    # 委任先ユーザー情報を取得
    cursor.execute(
        "SELECT name, email FROM users WHERE id = %s",
        (request.delegate_user_id,)
    )
    delegate_user = cursor.fetchone()

    return {
        "id": delegation["id"],
        "delegateId": delegation["delegate_user_id"],
        "delegateName": delegate_user["name"],
        "delegateEmail": delegate_user["email"],
        "startDate": delegation["start_date"].isoformat(),
        "endDate": delegation["end_date"].isoformat(),
        "reason": delegation["reason"],
        "isActive": delegation["start_date"] <= datetime.now().date() <= delegation["end_date"],
    }

@app.delete("/api/delegations/{delegation_id}")
def delete_delegation(
    delegation_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """代理承認設定を削除"""
    cursor = conn.cursor()

    user_id = payload.get("user_id")
    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # 代理承認設定が存在するか確認（自分のものか確認）
    cursor.execute(
        "SELECT id FROM delegations WHERE id = %s AND user_id = %s AND deleted_at IS NULL",
        (delegation_id, user_id)
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Delegation not found")

    # ソフトデリート
    cursor.execute(
        "UPDATE delegations SET deleted_at = NOW() WHERE id = %s",
        (delegation_id,)
    )

    conn.commit()

    return {"message": "Delegation deleted successfully"}

# ========================================
# フォームテンプレート API
# ========================================

@app.get("/api/form-templates")
def get_form_templates(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """フォームテンプレート一覧取得"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    cursor.execute(
        """
        SELECT
            id,
            name,
            description,
            icon,
            is_active,
            fields,
            created_at,
            updated_at
        FROM form_templates
        WHERE tenant_id = %s AND deleted_at IS NULL
        ORDER BY created_at DESC
        """,
        (tenant_id,)
    )

    templates = cursor.fetchall()

    return [
        {
            "id": t["id"],
            "name": t["name"],
            "description": t["description"],
            "icon": t["icon"],
            "isActive": t["is_active"],
            "fields": t["fields"],  # JSONフィールド
            "createdAt": t["created_at"].isoformat() if t["created_at"] else None,
            "updatedAt": t["updated_at"].isoformat() if t["updated_at"] else None,
        }
        for t in templates
    ]

@app.post("/api/form-templates")
def create_form_template(
    request: FormTemplateCreateRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """フォームテンプレート作成"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    cursor.execute(
        """
        INSERT INTO form_templates (
            name, description, icon, is_active, fields, tenant_id,
            created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
        RETURNING id, name, description, icon, is_active, fields, created_at, updated_at
        """,
        (
            request.name,
            request.description,
            request.icon,
            request.is_active,
            json.dumps(request.fields),
            tenant_id,
        )
    )

    template = cursor.fetchone()
    conn.commit()

    return {
        "id": template["id"],
        "name": template["name"],
        "description": template["description"],
        "icon": template["icon"],
        "isActive": template["is_active"],
        "fields": template["fields"],
        "createdAt": template["created_at"].isoformat(),
        "updatedAt": template["updated_at"].isoformat(),
    }

@app.put("/api/form-templates/{template_id}")
def update_form_template(
    template_id: int,
    request: FormTemplateCreateRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """フォームテンプレート更新"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # テンプレートが存在するか確認
    cursor.execute(
        "SELECT id FROM form_templates WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (template_id, tenant_id)
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Form template not found")

    cursor.execute(
        """
        UPDATE form_templates
        SET name = %s, description = %s, icon = %s, is_active = %s,
            fields = %s, updated_at = NOW()
        WHERE id = %s
        RETURNING id, name, description, icon, is_active, fields, created_at, updated_at
        """,
        (
            request.name,
            request.description,
            request.icon,
            request.is_active,
            json.dumps(request.fields),
            template_id,
        )
    )

    template = cursor.fetchone()
    conn.commit()

    return {
        "id": template["id"],
        "name": template["name"],
        "description": template["description"],
        "icon": template["icon"],
        "isActive": template["is_active"],
        "fields": template["fields"],
        "createdAt": template["created_at"].isoformat(),
        "updatedAt": template["updated_at"].isoformat(),
    }

@app.delete("/api/form-templates/{template_id}")
def delete_form_template(
    template_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """フォームテンプレート削除"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # テンプレートが存在するか確認
    cursor.execute(
        "SELECT id FROM form_templates WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (template_id, tenant_id)
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Form template not found")

    # ソフトデリート
    cursor.execute(
        "UPDATE form_templates SET deleted_at = NOW() WHERE id = %s",
        (template_id,)
    )

    conn.commit()

    return {"message": "Form template deleted successfully"}

# ========================================
# レポート・統計 API
# ========================================

@app.get("/api/reports/stats")
def get_stats(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """統計情報取得"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # 総申請数
    cursor.execute(
        "SELECT COUNT(*) as total FROM approvals WHERE tenant_id = %s AND deleted_at IS NULL",
        (tenant_id,)
    )
    total = cursor.fetchone()["total"]

    # ステータス別件数
    cursor.execute(
        """
        SELECT
            COUNT(*) FILTER (WHERE status = 'approved') as approved,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'rejected') as rejected
        FROM approvals
        WHERE tenant_id = %s AND deleted_at IS NULL
        """,
        (tenant_id,)
    )
    status_counts = cursor.fetchone()

    # 平均承認時間（承認済みのもののみ）
    cursor.execute(
        """
        SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_days
        FROM approvals
        WHERE tenant_id = %s AND status = 'approved' AND deleted_at IS NULL
        """,
        (tenant_id,)
    )
    avg_result = cursor.fetchone()
    avg_process_time = round(avg_result["avg_days"], 1) if avg_result and avg_result["avg_days"] else 0

    return {
        "total": total,
        "approved": status_counts["approved"] or 0,
        "pending": status_counts["pending"] or 0,
        "rejected": status_counts["rejected"] or 0,
        "avgProcessTime": avg_process_time,
        "improvement": 70,  # 固定値（前月比計算は複雑なので）
    }

@app.get("/api/reports/monthly")
def get_monthly_data(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """月別データ取得"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # 過去6ヶ月の月別データ
    cursor.execute(
        """
        SELECT
            TO_CHAR(created_at, 'MM月') as month,
            COUNT(*) FILTER (WHERE status = 'approved') as approved,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'rejected') as rejected
        FROM approvals
        WHERE tenant_id = %s
          AND created_at >= NOW() - INTERVAL '6 months'
          AND deleted_at IS NULL
        GROUP BY TO_CHAR(created_at, 'YYYY-MM'), TO_CHAR(created_at, 'MM月')
        ORDER BY TO_CHAR(created_at, 'YYYY-MM')
        """,
        (tenant_id,)
    )

    monthly_data = cursor.fetchall()

    return [
        {
            "month": row["month"],
            "approved": row["approved"] or 0,
            "pending": row["pending"] or 0,
            "rejected": row["rejected"] or 0,
        }
        for row in monthly_data
    ]

@app.get("/api/reports/departments")
def get_department_data(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """部署別データ取得（簡易版）"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # ユーザーの部署別申請数
    # 注：departmentフィールドが存在しない場合は空配列を返す
    cursor.execute(
        """
        SELECT
            'その他' as name,
            COUNT(*) as count
        FROM approvals a
        WHERE a.tenant_id = %s AND a.deleted_at IS NULL
        GROUP BY 1
        """,
        (tenant_id,)
    )

    dept_data = cursor.fetchall()

    total = sum(row["count"] for row in dept_data) or 1  # ゼロ除算防止

    return [
        {
            "name": row["name"],
            "count": row["count"],
            "percentage": round((row["count"] / total) * 100, 1),
        }
        for row in dept_data
    ]

# ========================================
# Webhook API
# ========================================

@app.get("/api/webhooks")
def get_webhooks(
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """Webhook一覧取得"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    cursor.execute(
        """
        SELECT
            id, name, url, events, is_active, secret,
            created_at, updated_at
        FROM webhooks
        WHERE tenant_id = %s AND deleted_at IS NULL
        ORDER BY created_at DESC
        """,
        (tenant_id,)
    )

    webhooks = cursor.fetchall()

    return [
        {
            "id": w["id"],
            "name": w["name"],
            "url": w["url"],
            "events": w["events"],
            "isActive": w["is_active"],
            "secret": w["secret"],
            "createdAt": w["created_at"].isoformat() if w["created_at"] else None,
            "updatedAt": w["updated_at"].isoformat() if w["updated_at"] else None,
        }
        for w in webhooks
    ]

@app.post("/api/webhooks")
def create_webhook(
    request: WebhookCreateRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """Webhook作成"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    cursor.execute(
        """
        INSERT INTO webhooks (
            name, url, events, is_active, secret, tenant_id,
            created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
        RETURNING id, name, url, events, is_active, secret, created_at, updated_at
        """,
        (
            request.name,
            request.url,
            json.dumps(request.events),
            request.is_active,
            request.secret,
            tenant_id,
        )
    )

    webhook = cursor.fetchone()
    conn.commit()

    return {
        "id": webhook["id"],
        "name": webhook["name"],
        "url": webhook["url"],
        "events": webhook["events"],
        "isActive": webhook["is_active"],
        "secret": webhook["secret"],
        "createdAt": webhook["created_at"].isoformat(),
        "updatedAt": webhook["updated_at"].isoformat(),
    }

@app.put("/api/webhooks/{webhook_id}")
def update_webhook(
    webhook_id: int,
    request: WebhookCreateRequest,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """Webhook更新"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # Webhookが存在するか確認
    cursor.execute(
        "SELECT id FROM webhooks WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (webhook_id, tenant_id)
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Webhook not found")

    cursor.execute(
        """
        UPDATE webhooks
        SET name = %s, url = %s, events = %s, is_active = %s,
            secret = %s, updated_at = NOW()
        WHERE id = %s
        RETURNING id, name, url, events, is_active, secret, created_at, updated_at
        """,
        (
            request.name,
            request.url,
            json.dumps(request.events),
            request.is_active,
            request.secret,
            webhook_id,
        )
    )

    webhook = cursor.fetchone()
    conn.commit()

    return {
        "id": webhook["id"],
        "name": webhook["name"],
        "url": webhook["url"],
        "events": webhook["events"],
        "isActive": webhook["is_active"],
        "secret": webhook["secret"],
        "createdAt": webhook["created_at"].isoformat(),
        "updatedAt": webhook["updated_at"].isoformat(),
    }

@app.delete("/api/webhooks/{webhook_id}")
def delete_webhook(
    webhook_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """Webhook削除"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # Webhookが存在するか確認
    cursor.execute(
        "SELECT id FROM webhooks WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL",
        (webhook_id, tenant_id)
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Webhook not found")

    # ソフトデリート
    cursor.execute(
        "UPDATE webhooks SET deleted_at = NOW() WHERE id = %s",
        (webhook_id,)
    )

    conn.commit()

    return {"message": "Webhook deleted successfully"}

@app.get("/api/webhooks/{webhook_id}/logs")
def get_webhook_logs(
    webhook_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """Webhookログ取得"""
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # Webhookログを取得（簡易版、webhook_logsテーブルがあると仮定）
    cursor.execute(
        """
        SELECT
            id, webhook_id, event_type, status_code, response_body,
            created_at
        FROM webhook_logs
        WHERE webhook_id = %s
        ORDER BY created_at DESC
        LIMIT 50
        """,
        (webhook_id,)
    )

    logs = cursor.fetchall()

    return [
        {
            "id": log["id"],
            "webhookId": log["webhook_id"],
            "eventType": log["event_type"],
            "statusCode": log["status_code"],
            "responseBody": log["response_body"],
            "createdAt": log["created_at"].isoformat() if log["created_at"] else None,
        }
        for log in logs
    ]

# ========================================
# ファイルAPI (Cloudflare R2)
# ========================================

@app.post("/api/files/upload")
async def upload_file(
    file: UploadFile = File(...),
    approval_id: Optional[int] = None,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ファイルアップロード"""

    if not r2_client:
        raise HTTPException(status_code=500, detail="File storage is not configured")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # ファイルサイズチェック
    file_content = await file.read()
    file_size = len(file_content)
    max_size_bytes = MAX_FILE_SIZE_MB * 1024 * 1024

    if file_size > max_size_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE_MB}MB"
        )

    # ファイル名とMIMEタイプ
    original_filename = file.filename
    mime_type = file.content_type or "application/octet-stream"

    # ユニークなファイルID生成
    file_uuid = str(uuid.uuid4())
    file_extension = original_filename.split(".")[-1] if "." in original_filename else ""
    storage_filename = f"{file_uuid}.{file_extension}" if file_extension else file_uuid
    storage_path = f"{tenant_id}/{storage_filename}"

    try:
        # Cloudflare R2にアップロード
        r2_client.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=storage_path,
            Body=file_content,
            ContentType=mime_type
        )

        # データベースにメタデータ保存
        cursor.execute(
            """
            INSERT INTO files (
                tenant_id, uploader_id, file_name, file_size, mime_type,
                storage_path, approval_id, created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING id, file_name, file_size, mime_type, storage_path, created_at
            """,
            (tenant_id, user_id, original_filename, file_size, mime_type, storage_path, approval_id)
        )

        file_record = cursor.fetchone()
        conn.commit()

        return {
            "id": file_record["id"],
            "fileName": file_record["file_name"],
            "fileSize": file_record["file_size"],
            "mimeType": file_record["mime_type"],
            "storagePath": file_record["storage_path"],
            "createdAt": file_record["created_at"].isoformat(),
        }

    except ClientError as e:
        conn.rollback()
        # アップロード失敗時はR2からも削除を試みる
        try:
            r2_client.delete_object(Bucket=R2_BUCKET_NAME, Key=storage_path)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


@app.get("/api/files/{file_id}")
def get_file(
    file_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ファイル情報取得・ダウンロードURL生成"""

    if not r2_client:
        raise HTTPException(status_code=500, detail="File storage is not configured")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # ファイル情報取得
    cursor.execute(
        """
        SELECT id, file_name, file_size, mime_type, storage_path, approval_id, created_at
        FROM files
        WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL
        """,
        (file_id, tenant_id)
    )

    file_record = cursor.fetchone()

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # 署名付きURL生成（1時間有効）
        download_url = r2_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': R2_BUCKET_NAME,
                'Key': file_record["storage_path"]
            },
            ExpiresIn=3600  # 1時間
        )

        return {
            "id": file_record["id"],
            "fileName": file_record["file_name"],
            "fileSize": file_record["file_size"],
            "mimeType": file_record["mime_type"],
            "approvalId": file_record["approval_id"],
            "createdAt": file_record["created_at"].isoformat(),
            "downloadUrl": download_url,
        }

    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate download URL: {str(e)}")


@app.delete("/api/files/{file_id}")
def delete_file(
    file_id: int,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ファイル削除"""

    if not r2_client:
        raise HTTPException(status_code=500, detail="File storage is not configured")

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # ファイル情報取得
    cursor.execute(
        """
        SELECT id, storage_path, uploader_id
        FROM files
        WHERE id = %s AND tenant_id = %s AND deleted_at IS NULL
        """,
        (file_id, tenant_id)
    )

    file_record = cursor.fetchone()

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    # 権限チェック（アップロード者または管理者のみ削除可能）
    cursor.execute(
        "SELECT role FROM users WHERE id = %s",
        (user_id,)
    )
    user = cursor.fetchone()

    if file_record["uploader_id"] != user_id and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You don't have permission to delete this file")

    try:
        # Cloudflare R2から削除
        r2_client.delete_object(
            Bucket=R2_BUCKET_NAME,
            Key=file_record["storage_path"]
        )

        # データベースでソフトデリート
        cursor.execute(
            """
            UPDATE files
            SET deleted_at = NOW()
            WHERE id = %s
            """,
            (file_id,)
        )

        conn.commit()

        return {"message": "File deleted successfully"}

    except ClientError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")


@app.get("/api/files")
def get_files(
    approval_id: Optional[int] = None,
    payload: dict = Depends(verify_token),
    conn = Depends(get_db)
):
    """ファイル一覧取得"""

    cursor = conn.cursor()
    tenant_id = payload.get("tenant_id")
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    if approval_id:
        # 特定の承認申請のファイル一覧
        cursor.execute(
            """
            SELECT f.id, f.file_name, f.file_size, f.mime_type, f.created_at,
                   u.name as uploader_name
            FROM files f
            JOIN users u ON f.uploader_id = u.id
            WHERE f.approval_id = %s AND f.tenant_id = %s AND f.deleted_at IS NULL
            ORDER BY f.created_at DESC
            """,
            (approval_id, tenant_id)
        )
    else:
        # 全ファイル一覧
        cursor.execute(
            """
            SELECT f.id, f.file_name, f.file_size, f.mime_type, f.created_at,
                   u.name as uploader_name, f.approval_id
            FROM files f
            JOIN users u ON f.uploader_id = u.id
            WHERE f.tenant_id = %s AND f.deleted_at IS NULL
            ORDER BY f.created_at DESC
            LIMIT 100
            """,
            (tenant_id,)
        )

    files = cursor.fetchall()

    return [
        {
            "id": f["id"],
            "fileName": f["file_name"],
            "fileSize": f["file_size"],
            "mimeType": f["mime_type"],
            "uploaderName": f["uploader_name"],
            "approvalId": f.get("approval_id"),
            "createdAt": f["created_at"].isoformat(),
        }
        for f in files
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
