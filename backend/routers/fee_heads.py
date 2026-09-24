from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/fee-heads", tags=["Fee Heads"])

@router.post("/", response_model=schemas.FeeHeadResponse)
def create_fee_head(fee_head: schemas.FeeHeadCreate, db: Session = Depends(get_db)):
    db_fee_head = models.FeeHead(**fee_head.model_dump())
    db.add(db_fee_head)
    db.commit()
    db.refresh(db_fee_head)
    return db_fee_head

@router.get("/", response_model=list[schemas.FeeHeadResponse])
def get_all_fee_heads(db: Session = Depends(get_db)):
    return db.query(models.FeeHead).all()