from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REVERSED = "REVERSED"

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    roll_number = Column(String(50), unique=True, index=True)

class FeeHead(Base):
    __tablename__ = "fee_heads"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # e.g., "Tuition Fee", "Transport Fee"
    default_amount = Column(Float, nullable=False)

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    fee_head_id = Column(Integer, ForeignKey("fee_heads.id"))
    total_amount = Column(Float, nullable=False)
    outstanding_amount = Column(Float, nullable=False)
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    
    # Relationships for easy querying
    student = relationship("Student")
    fee_head = relationship("FeeHead")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    amount_paid = Column(Float, nullable=False)
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    gateway_reference = Column(String(100), nullable=True) # E.g., a mock Stripe/Bank ID
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())
    
    invoice = relationship("Invoice")
