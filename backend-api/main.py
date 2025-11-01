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

# 環境変数読み込み
load_dotenv()

# FastAPIアプリ
app = FastAPI(
    title="ApprovalHub API",
    description="ワークフロー承認システム",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# セキュリティ
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT設定
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# データベース接続
def get_db():
    conn = psycopg2.connect(
        os.getenv("DATABASE_URL"),
        cursor_factory=RealDictCursor
    )
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
    cursor = conn.cursor()

    tenant_id = payload.get("tenant_id")
    user_id = payload.get("user_id")

    # RLS設定
    cursor.execute("SET app.current_tenant_id = %s", (tenant_id,))

    # 承認一覧取得
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

    query += " ORDER BY a.created_at DESC"

    cursor.execute(query, params)
    approvals = cursor.fetchall()

    return approvals

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
