from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import SessionLocal, User, Transaction

import shutil
import os
import requests
import threading
import time
import random
import smtplib
from email.mime.text import MIMEText

from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer

# ================= CONFIG =================
SECRET_KEY = "gigsecure_secret_key"
ALGORITHM = "HS256"
API_KEY = "650d0391a13ed3a592142fbb14bed3cf"

SENDER_EMAIL = "2300031455cseh@gmail.com"
SENDER_PASSWORD = "dzeorayvejyjxbxr"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= FOLDER =================
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================= OTP =================
otp_store = {}

# ================= DB =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= EMAIL FIXED =================
def send_email(to_email, subject, body):
    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email

        server = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()

        print(f"✅ Email sent to {to_email}")

    except Exception as e:
        print("❌ EMAIL ERROR:", str(e))
        print("⚠️ OTP fallback shown in terminal")

# ================= JWT =================
def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=60)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401)
        return email
    except JWTError:
        raise HTTPException(status_code=401)

# ================= DISASTER =================
def detect_disaster(temp, aqi, rain):
    if temp > 45:
        return "Extreme Heat"
    elif aqi > 300:
        return "High Pollution"
    elif rain > 70:
        return "Heavy Rain"
    return "No Disaster"

def get_weather():
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid={API_KEY}&units=metric"
        res = requests.get(url, timeout=5).json()
        return res["main"]["temp"], res.get("rain", {}).get("1h", 0)
    except:
        return 30, 0

def get_aqi():
    try:
        url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat=17.3850&lon=78.4867&appid={API_KEY}"
        res = requests.get(url, timeout=5).json()
        return res["list"][0]["main"]["aqi"] * 100
    except:
        return 100

# ================= HOME =================
@app.get("/")
def home():
    return {"message": "GigSecure Backend Running 🚀"}

# ================= OTP =================
@app.post("/send-otp")
def send_otp(data: dict):
    email = data.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Email required")

    otp = str(random.randint(1000, 9999))
    otp_store[email] = otp

    send_email(email, "GigSecure OTP", f"Your OTP is: {otp}")

    print(f"📌 OTP for {email}: {otp}")  # fallback

    return {"msg": "OTP sent"}

# ================= VERIFY OTP =================
@app.post("/verify-otp")
def verify_otp(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    otp = data.get("otp")

    if otp_store.get(email) != otp:
        return {"msg": "Invalid OTP"}

    user = User(
        email=email,
        name=data.get("name"),
        phone=data.get("phone"),
        bank=data.get("bank"),
        account_type=data.get("account_type"),
        account_number=data.get("account_number"),
        ifsc_code=data.get("ifsc_code"),
        upi_id=data.get("upi_id"),
        password=data.get("password"),
        balance=1000,
        plan=data.get("plan")
    )

    db.add(user)
    db.commit()

    otp_store.pop(email, None)

    return {"msg": "User Registered"}

# ================= LOGIN =================
@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.get("email")).first()

    if not user or user.password != data.get("password"):
        return {"msg": "Invalid credentials"}

    token = create_access_token({"sub": user.email})

    return {
        "msg": "Login Success",
        "token": token,
        "user": user.__dict__
    }

# ================= IMAGE =================
@app.post("/upload/{email}")
def upload(email: str, file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, f"{email}.jpg")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"msg": "Image uploaded"}

@app.get("/image/{email}")
def get_image(email: str):
    file_path = os.path.join(UPLOAD_DIR, f"{email}.jpg")

    if os.path.exists(file_path):
        return FileResponse(file_path)

    raise HTTPException(status_code=404)

# ================= AUTO SYSTEM =================
def auto_system():
    while True:
        db = SessionLocal()
        users = db.query(User).all()

        for user in users:
            try:
                temp, rain = get_weather()
                aqi = get_aqi()

                disaster = detect_disaster(temp, aqi, rain)

                if disaster != "No Disaster":
                    user.balance -= 200

                    tx = Transaction(
                        user_email=user.email,
                        type="deduction",
                        amount=200,
                        reason=disaster
                    )
                    db.add(tx)

                    send_email(
                        user.email,
                        "⚠️ Disaster Alert",
                        f"₹200 deducted due to {disaster}"
                    )

                    print(f"{user.email} → ₹{user.balance}")

            except Exception as e:
                print("Auto error:", e)

        db.commit()
        db.close()
        time.sleep(30)

threading.Thread(target=auto_system, daemon=True).start()