from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/pay", response_model=schemas.TransactionResponse)
def make_payment(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    invoice = db.query(models.Invoice).filter(models.Invoice.id == transaction.invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    if transaction.amount_paid <= 0:
        raise HTTPException(status_code=400, detail="Payment amount must be positive")
    if transaction.amount_paid > invoice.outstanding_amount:
        raise HTTPException(status_code=400, detail="Amount exceeds outstanding balance")

    try:
        # Deduct the payment from the outstanding amount (inside a transaction)
        invoice.outstanding_amount -= transaction.amount_paid
        if invoice.outstanding_amount == 0:
            invoice.status = models.PaymentStatus.SUCCESS

        db_transaction = models.Transaction(
            invoice_id=transaction.invoice_id,
            amount_paid=transaction.amount_paid,
            status=models.PaymentStatus.SUCCESS,
            gateway_reference=transaction.gateway_reference
        )
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Payment failed. Please try again.")

@router.get("/invoice/{invoice_id}", response_model=list[schemas.TransactionResponse])
def get_invoice_transactions(invoice_id: int, db: Session = Depends(get_db)):
    return db.query(models.Transaction).filter(models.Transaction.invoice_id == invoice_id).all()
