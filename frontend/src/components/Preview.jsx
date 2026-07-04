import React, { useState } from 'react';
import { downloadSinglePDF } from '../utils/api';

export default function Preview({ template, loans }) {
  const [selectedLoanIndex, setSelectedLoanIndex] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [downloading, setDownloading] = useState(false);

  if (!template) {
    return (
      <div className="alert-info">
        Select a template from the list on the left to preview and generate letters.
      </div>
    );
  }

  const selectedLoan = loans[selectedLoanIndex];

  // Client-side template interpolation for live preview
  const compileTemplate = (body, loan) => {
    if (!body) return '';
    if (!loan) return body;
    let result = body;
    const placeholders = ['borrower_name', 'loan_no', 'outstanding_amount', 'due_date', 'address', 'email', 'phone'];
    placeholders.forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, loan[key] !== undefined ? loan[key] : `{{${key}}}`);
    });
    return result;
  };

  const compiledText = compileTemplate(template.body, selectedLoan);

  const handleDownloadSingle = async () => {
    if (!selectedLoan) return;
    setDownloading(true);
    try {
      setDownloadStatus(`Generating PDF for ${selectedLoan.borrower_name}...`);
      await downloadSinglePDF(template.name, template.body, selectedLoan);
      setDownloadStatus('Download complete.');
      setTimeout(() => setDownloadStatus(''), 3000);
    } catch (err) {
      alert('Error generating PDF: ' + err.message);
      setDownloadStatus('');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (loans.length === 0) return;
    setDownloading(true);
    try {
      for (let i = 0; i < loans.length; i++) {
        const loan = loans[i];
        setDownloadStatus(`Downloading PDF ${i + 1} of ${loans.length} (Loan: ${loan.loan_no})...`);
        await downloadSinglePDF(template.name, template.body, loan);
        // Wait 800ms between downloads to allow browser time to start the downloads safely
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      setDownloadStatus('All 10 PDFs downloaded successfully!');
      setTimeout(() => setDownloadStatus(''), 4000);
    } catch (err) {
      alert('Error during bulk download: ' + err.message);
      setDownloadStatus('');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h3 className="pane-title">Preview & Download: {template.name}</h3>

      {downloadStatus && <div className="status-banner">{downloadStatus}</div>}

      <div className="preview-controls">
        <div className="form-group">
          <label htmlFor="preview-loan-select">Select Loan Data for Preview:</label>
          <select
            id="preview-loan-select"
            value={selectedLoanIndex}
            onChange={(e) => setSelectedLoanIndex(Number(e.target.value))}
            disabled={downloading || loans.length === 0}
          >
            {loans.map((loan, idx) => (
              <option key={loan.loan_no} value={idx}>
                {loan.borrower_name} ({loan.loan_no})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#555' }}>
        <strong>Current Loan Information:</strong>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
          <li>Outstanding: INR {selectedLoan?.outstanding_amount}</li>
          <li>Due Date: {selectedLoan?.due_date}</li>
          <li>Address: {selectedLoan?.address}</li>
        </ul>
      </div>

      <div className="preview-box">
        {compiledText}
      </div>

      <div className="button-group">
        <button
          onClick={handleDownloadSingle}
          className="primary-btn"
          disabled={downloading || !selectedLoan}
        >
          Download PDF (Selected Loan)
        </button>
        <button
          onClick={handleDownloadAll}
          className="secondary-btn"
          disabled={downloading || loans.length === 0}
        >
          Download PDFs for All 10 Loans
        </button>
      </div>
    </div>
  );
}
