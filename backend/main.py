from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import students, fee_heads, invoices, transactions

# Auto-create all tables in MySQL
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Edumerge Fee Collection API")

# Allow the Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(students.router)
app.include_router(fee_heads.router)
app.include_router(invoices.router)
app.include_router(transactions.router)

@app.get("/")
def read_root():
    return {"message": "Edumerge Fee Collection API is Running!"}
