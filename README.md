# Edumerge Solutions - Smart Fee Collection & Reconciliation System

A comprehensive full-stack web application designed for educational institutions to automate student fee management, multi-item invoicing, payment reconciliation, and real-time financial tracking.

---

## 🚀 Tech Stack

- **Backend:** FastAPI (Python 3.10+), SQLAlchemy ORM, SQLite, Pydantic v2
- **Frontend:** Next.js 15 (App Router), TypeScript, Vanilla CSS (Modern Dark UI)
- **API Communication:** RESTful API with CORS middleware

---

## 📁 Project Structure

```text
Edumerge_Solutions/
├── backend/
│   ├── main.py               # FastAPI entry point, CORS & table initialization
│   ├── database.py           # SQLite connection & session maker
│   ├── models.py             # SQLAlchemy database models
│   ├── schemas.py            # Pydantic validation schemas
│   └── routers/
│       ├── students.py       # Student enrollment & profile endpoints
│       ├── fee_heads.py      # Fee category & head management
│       ├── invoices.py       # Multi-item invoice generation & tracking
│       ├── transactions.py   # Payment collection & ledger
│       └── analytics.py      # Financial metrics & overview data
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Dashboard overview page
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── globals.css         # Global design system & theme variables
│   │   │   ├── components/
│   │   │   │   └── Sidebar.tsx     # Navigation sidebar with active highlighting
│   │   │   ├── students/page.tsx   # Student directory & onboarding
│   │   │   ├── fee-heads/page.tsx  # Fee structure configuration
│   │   │   ├── invoices/page.tsx   # Invoicing & status view
│   │   │   └── payments/page.tsx   # Payment recording & audit trail
│   │   └── services/
│   │       └── api.ts              # API service client
│   └── package.json
├── requirements.txt          # Python dependencies
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm

---

### 2. Backend Setup

Open a terminal in the project root:

```powershell
cd "c:\ML Project\Edumerge_Solutions"
```

*(Optional) Create and activate a virtual environment:*
```powershell
python -m venv venv
.\venv\Scripts\activate
```

Install backend dependencies:
```powershell
pip install -r requirements.txt
```

Start the FastAPI backend server:
```powershell
cd backend
uvicorn main:app --reload --port 8000
```

- **Backend URL:** `http://localhost:8000`
- **Interactive Swagger API Docs:** `http://localhost:8000/docs`

---

### 3. Frontend Setup

Open a **second terminal** and navigate to the frontend folder:

```powershell
cd "c:\ML Project\Edumerge_Solutions\frontend"
```

Install dependencies:
```powershell
npm install
```

Start the Next.js development server:
```powershell
npm run dev
```

- **Frontend Application:** `http://localhost:3000`

---

## 🌟 Key Modules & Features

1. **📊 Financial Dashboard (`/`):**
   - Live metrics: Total Collections, Outstanding Balances, Total Students, and Active Invoices.
   - Quick overview of recent transactions and ledger items.

2. **🎓 Students Management (`/students`):**
   - Enroll new students with Name, Roll Number, Class/Grade, and Contact details.
   - Complete directory roster.

3. **📋 Fee Heads Configuration (`/fee-heads`):**
   - Define custom fee heads (Tuition, Transport, Lab, Library, Examination).
   - Configure recurrence (Monthly, Term, Annual) and default pricing.

4. **🧾 Invoicing Engine (`/invoices`):**
   - Generate student-specific invoices with itemized fee head selections.
   - Automatic calculation of subtotal, dues, and payment statuses (`PENDING`, `PARTIAL`, `PAID`).

5. **💳 Payments & Reconciliation (`/payments`):**
   - Record payments via Cash, Bank Transfer, UPI, or Cheque.
   - Auto-deduction from student outstanding balances and real-time ledger generation.
