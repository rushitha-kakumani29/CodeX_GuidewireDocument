from sqlalchemy import create_engine, Column, String, Integer, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./gigsecure.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    email = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    bank = Column(String, nullable=True)
    account_type = Column(String, nullable=True, default="Savings")
    account_number = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=True)
    upi_id = Column(String, nullable=True)
    password = Column(String, nullable=False)
    balance = Column(Integer, default=1000)
    plan = Column(String, default="weekly")

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    type = Column(String, nullable=False)   # deduction / credit
    amount = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)

    user = relationship("User", back_populates="transactions")


Base.metadata.create_all(bind=engine)