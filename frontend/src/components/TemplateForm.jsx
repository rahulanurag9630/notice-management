import React, { useState, useEffect } from 'react';
import { createTemplate, updateTemplate } from '../utils/api';

export default function TemplateForm({ selectedTemplate, onSubmitSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const placeholders = [
    'borrower_name',
    'loan_no',
    'outstanding_amount',
    'due_date',
    'address',
    'email',
    'phone'
  ];

  useEffect(() => {
    if (selectedTemplate) {
      setName(selectedTemplate.name);
      setBody(selectedTemplate.body);
    } else {
      setName('');
      setBody('');
    }
    setError('');
  }, [selectedTemplate]);

  const insertPlaceholder = (placeholder) => {
    const textarea = document.getElementById('template-body-textarea');
    if (!textarea) {
      setBody(prev => prev + ` {{${placeholder}}}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newVal = before + `{{${placeholder}}}` + after;
    setBody(newVal);
    
    // Set cursor focus immediately after the inserted placeholder
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + placeholder.length + 4; // length of "{{placeholder}}"
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      setError('Please fill in both name and body fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (selectedTemplate) {
        // Edit template
        const updated = await updateTemplate(selectedTemplate.id, { name, body });
        onSubmitSuccess(updated);
      } else {
        // Create template
        const created = await createTemplate({ name, body });
        onSubmitSuccess(created);
      }
    } catch (err) {
      setError(err.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="pane-title">
        {selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : 'Create Notice Template'}
      </h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="template-name">Template Name</label>
          <input
            type="text"
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Late Fee Intimation"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Click to Insert Dynamic Placeholders:</label>
          <div className="placeholder-container">
            {placeholders.map(ph => (
              <button
                key={ph}
                type="button"
                className="placeholder-tag"
                onClick={() => insertPlaceholder(ph)}
                disabled={loading}
              >
                &#123;&#123;{ph}&#125;&#125;
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="template-body-textarea">Notice Letter Body</label>
          <textarea
            id="template-body-textarea"
            rows="10"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your letter content here. Use placeholders above to insert dynamic loan data fields."
            required
            disabled={loading}
          />
        </div>

        <div className="button-group">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Template'}
          </button>
          {onCancel && (
            <button type="button" className="secondary-btn" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
