import React, { useState, useEffect } from 'react';
import { getLoans, getTemplates, deleteTemplate } from '../utils/api';
import TemplateForm from './TemplateForm';
import Preview from './Preview';

export default function Dashboard({ onLogout }) {
  const [loans, setLoans] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [loansData, templatesData] = await Promise.all([
        getLoans(),
        getTemplates()
      ]);
      setLoans(loansData);
      setTemplates(templatesData);
      
      // Auto-select first template if available and none selected
      if (templatesData.length > 0 && !selectedTemplate) {
        setSelectedTemplate(templatesData[0]);
      }
    } catch (err) {
      setError('Failed to fetch data from server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNewClick = () => {
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditing(false);
  };

  const handleEditTemplateClick = (e, template) => {
    e.stopPropagation(); // Avoid selecting it
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleDeleteTemplateClick = async (e, id) => {
    e.stopPropagation(); // Avoid selecting it
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      await deleteTemplate(id);
      
      // Update local state
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(updated.length > 0 ? updated[0] : null);
        setIsEditing(false);
      }
    } catch (err) {
      alert('Failed to delete template: ' + err.message);
    }
  };

  const handleFormSubmitSuccess = (savedTemplate) => {
    // Reload all templates
    fetchData().then(() => {
      setSelectedTemplate(savedTemplate);
      setIsEditing(false);
    });
  };

  const handleFormCancel = () => {
    setIsEditing(false);
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  };

  if (loading && templates.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard data...</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Notice Management System</h1>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>

      {error && <div className="error-message" style={{ margin: '1.5rem' }}>{error}</div>}

      <div className="dashboard-layout">
        {/* Left Pane: Templates List & Management */}
        <div className="left-pane">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#111827' }}>Notice Templates</h3>
            <button className="action-btn" style={{ backgroundColor: '#10b981' }} onClick={handleCreateNewClick}>
              + Create Template
            </button>
          </div>

          {templates.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No templates saved. Click "+ Create Template" to add one.</p>
          ) : (
            <div>
              {templates.map(tpl => (
                <div
                  key={tpl.id}
                  className={`template-item ${selectedTemplate?.id === tpl.id ? 'active' : ''}`}
                  onClick={() => handleSelectTemplate(tpl)}
                >
                  <div className="template-info">
                    <h4>{tpl.name}</h4>
                  </div>
                  <div>
                    <button
                      className="action-btn"
                      onClick={(e) => handleEditTemplateClick(e, tpl)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={(e) => handleDeleteTemplateClick(e, tpl.id)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane: Editor or Live Preview/Downloader */}
        <div className="right-pane">
          {isEditing ? (
            <TemplateForm
              selectedTemplate={selectedTemplate}
              onSubmitSuccess={handleFormSubmitSuccess}
              onCancel={handleFormCancel}
            />
          ) : (
            <Preview
              template={selectedTemplate}
              loans={loans}
            />
          )}
        </div>
      </div>
    </div>
  );
}
