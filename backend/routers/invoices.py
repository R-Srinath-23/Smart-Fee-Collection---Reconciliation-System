from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.post("/", response_model=schemas.InvoiceResponse)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == invoice.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    fee_head = db.query(models.FeeHead).filter(models.FeeHead.id == invoice.fee_head_id).first()
    if not fee_head:
        raise HTTPException(status_code=404, detail="Fee head not found")
    db_invoice = models.Invoice(
        student_id=invoice.student_id,
        fee_head_id=invoice.fee_head_id,
        total_amount=invoice.total_amount,
        outstanding_amount=invoice.total_amount  # Initially, full amount is outstanding
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.get("/student/{student_id}", response_model=list[schemas.InvoiceResponse])
def get_student_invoices(student_id: int, db: Session = Depends(get_db)):
    return db.query(models.Invoice).filter(models.Invoice.student_id == student_id).all()
