from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional
from datetime import datetime

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REVERSED = "REVERSED"

# --- Student Schemas ---
class StudentCreate(BaseModel):
    name: str
    roll_number: str

class StudentResponse(StudentCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Fee Head Schemas ---
class FeeHeadCreate(BaseModel):
    name: str
    default_amount: float

class FeeHeadResponse(FeeHeadCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Invoice Schemas ---
class InvoiceCreate(BaseModel):
    student_id: int
    fee_head_id: int
    total_amount: float

class InvoiceResponse(InvoiceCreate):
    id: int
    outstanding_amount: float
    status: PaymentStatus
    model_config = ConfigDict(from_attributes=True)

# --- Transaction Schemas ---
class TransactionCreate(BaseModel):
    invoice_id: int
    amount_paid: float
    gateway_reference: Optional[str] = None

class TransactionResponse(TransactionCreate):
    id: int
    status: PaymentStatus
    transaction_date: datetime
    model_config = ConfigDict(from_attributes=True)
