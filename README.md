# Notice Management Module
A lightweight, self-contained web application that allows users to create legal notice templates (e.g., intimation letters, demand notices), preview them interactively against loan data, and download the generated letters as individual PDF files.
---
## Tech Stack
* **Frontend**: React.js (Vite, Standard JS & Vanilla CSS)
* **Backend**: Node.js (Express)
* **Data Source**: Local JSON files (mock databases for loans and templates)
* **PDF Engine**: PDFKit (server-side PDF rendering and streaming)
---
## Key Features
1. **Simple Login Auth**: Basic verification using hardcoded credentials.
2. **Dynamic Template Creator**: Build templates with clickable dynamic variables/placeholders (e.g., `{{borrower_name}}`, `{{loan_no}}`, `{{outstanding_amount}}`, `{{due_date}}`, `{{address}}`, `{{email}}`, `{{phone}}`).
3. **Seeded Loan Records**: Pre-seeded with 10 detailed sample loan accounts.
4. **Live Interactive Preview**: Select any template and preview the interpolated final letter dynamically against any of the 10 seeded loans.
5. **PDF Generator & Downloader**:
   * Download a single PDF for a selected loan.
   * Download individual PDFs for all 10 loans in a sequential, rate-limited flow (to prevent browser download blockage).
---
## Project Structure
```
notice-management/
├── backend/
│   ├── data/
│   │   ├── loans.json          # Seeded database of 10 loan records
│   │   └── templates.json      # JSON storage for notice templates
│   ├── controllers/
│   │   ├── authController.js   # Handles login logic
│   │   ├── loanController.js   # Fetches sample loan records
│   │   └── templateController.js # Handles templates CRUD and PDF generation
│   ├── routes/
│   │   ├── authRoutes.js       # Auth API routing
│   │   ├── loanRoutes.js       # Loan API routing
│   │   └── templateRoutes.js   # Template API routing
│   ├── utils/
│   │   └── db.js               # Helper functions to read/write JSON files
│   ├── package.json            # Backend package definitions (express, cors, pdfkit)
│   └── server.js               # Express server entry point
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx       # Login Screen UI
    │   │   ├── Dashboard.jsx   # Split-pane workspace manager
    │   │   ├── TemplateForm.jsx # Editor to create/edit templates
    │   │   └── Preview.jsx     # Preview letter & trigger downloads
    │   ├── utils/
    │   │   └── api.js          # Fetch API calls wrapper
    │   ├── App.jsx             # Session holder & main app router
    │   ├── index.css           # Clean, standard dashboard styling
    │   └── main.jsx            # React application entry point
    ├── index.html              # HTML shell
    ├── vite.config.js          # Vite configurations
    └── package.json            # Frontend package definitions (react, vite)
```
---
## Setup Instructions
Make sure you have [Node.js](https://nodejs.org/) (v16+) installed.
### 1. Install Backend Dependencies
Navigate to the `backend` directory and install the packages:
```bash
cd backend
npm install
```
### 2. Install Frontend Dependencies
Navigate to the `frontend` directory and install the packages:
```bash
cd ../frontend
npm install
```
---
## Running the Application
For development, start both the backend server and frontend development server in separate terminal windows.
### 1. Start the Backend Server (Express)
From the `backend` directory:
```bash
npm start
```
* The backend server will run on: **http://localhost:5000**
### 2. Start the Frontend Development Server (Vite)
From the `frontend` directory:
```bash
npm run dev
```
* The React application will run on: **http://localhost:5173**
---
## Operating Instructions
### 1. Login
* Open your web browser and go to: **http://localhost:5173**
* Log in using the following credentials:
  * **Username**: `admin`
  * **Password**: `password123`
### 2. Manage Templates
* **Create a Template**: Click the **+ Create Template** button on the left panel. Enter a template name (e.g., `Urgent Intimation`) and draft your letter. Click on any of the dynamic variable buttons above the editor to insert them at your cursor's current position. Click **Save Template**.
* **Edit a Template**: Click the **Edit** button next to a template in the left-hand sidebar to reload it into the form editor.
* **Delete a Template**: Click the **Delete** button next to a template to remove it permanently.
### 3. Live Preview notice body
* Select a template from the list on the left-hand panel.
* Choose a loan account from the dropdown selection.
* The box below the dropdown will render a real-time preview of the notice letter with placeholders replaced by actual loan data.
### 4. Downloading Notices
* **Download Single PDF**: Click **Download PDF (Selected Loan)** to download the notice for the currently selected loan (file naming: `{Notice_Name}_{Loan_No}.pdf`).
* **Download All Notices**: Click **Download PDFs for All 10 Loans** to trigger 10 individual PDF downloads sequentially for all seeded accounts.
