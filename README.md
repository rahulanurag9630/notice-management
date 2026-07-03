# Setup & Operating Guide

Follow these steps to set up, run, and operate the Notice Management application.

---

## Setup Instructions

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Backend Dependencies
Navigate to the `backend` directory and run:
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
Navigate to the `frontend` directory and run:
```bash
cd ../frontend
npm install
```

---

## Running the Application

Open two separate terminal windows to run the servers concurrently:

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```
* Server runs on: **http://localhost:5000**

### Terminal 2: Start Frontend Server
```bash
cd frontend
npm run dev
```
* Application runs on: **http://localhost:5173**

---

## Operating Instructions

### 1. Login Credentials
* Navigate to **http://localhost:5173**
* **Username**: `admin`
* **Password**: `password123`

### 2. Creating Notice Templates
1. Click the **+ Create Template** button on the left sidebar.
2. Enter a template name and write the letter body.
3. Use the dynamic placeholder buttons above the editor to insert variables (e.g., `{{borrower_name}}`, `{{loan_no}}`) directly at the cursor position.
4. Click **Save Template**.

### 3. Modifying Notice Templates
* **Edit**: Click the **Edit** button next to a template in the left sidebar, update the content, and click **Save Template**.
* **Delete**: Click the **Delete** button next to a template in the sidebar.

### 4. Previewing Notice Data
1. Select a saved template from the list in the left sidebar.
2. Select any loan account from the dropdown list on the right panel.
3. The preview box will dynamically display the letter text with placeholders replaced by actual loan data.

### 5. Downloading Notices
* **Download Single PDF**: Click **Download PDF (Selected Loan)** to download a PDF named `{template_name}_{loan_no}.pdf` for the selected loan account.
* **Download All PDFs**: Click **Download PDFs for All 10 Loans** to trigger 10 individual PDF downloads sequentially for all seeded loan records.
