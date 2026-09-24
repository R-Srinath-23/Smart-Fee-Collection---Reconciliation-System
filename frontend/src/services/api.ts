const BASE_URL = "http://127.0.0.1:8000";

export const api = {
    // Students
    getStudents: () => fetch(`${BASE_URL}/students/`).then(r => r.json()),
    createStudent: (data: { name: string; roll_number: string }) =>
        fetch(`${BASE_URL}/students/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),

    // Fee Heads
    getFeeHeads: () => fetch(`${BASE_URL}/fee-heads/`).then(r => r.json()),
    createFeeHead: (data: { name: string; default_amount: number }) =>
        fetch(`${BASE_URL}/fee-heads/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),

    // Invoices
    getStudentInvoices: (studentId: number) => fetch(`${BASE_URL}/invoices/student/${studentId}`).then(r => r.json()),
    createInvoice: (data: { student_id: number; fee_head_id: number; total_amount: number }) =>
        fetch(`${BASE_URL}/invoices/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),

    // Transactions
    makePayment: (data: { invoice_id: number; amount_paid: number; gateway_reference?: string }) =>
        fetch(`${BASE_URL}/transactions/pay`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    getInvoiceTransactions: (invoiceId: number) => fetch(`${BASE_URL}/transactions/invoice/${invoiceId}`).then(r => r.json()),
};