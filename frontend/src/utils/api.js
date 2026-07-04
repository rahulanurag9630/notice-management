const API_BASE_URL = 'http://localhost:5000/api';

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function getLoans() {
  const response = await fetch(`${API_BASE_URL}/loans`);
  if (!response.ok) {
    throw new Error('Failed to fetch loans');
  }
  return response.json();
}

export async function getTemplates() {
  const response = await fetch(`${API_BASE_URL}/templates`);
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  return response.json();
}

export async function createTemplate(template) {
  const response = await fetch(`${API_BASE_URL}/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(template)
  });
  if (!response.ok) {
    throw new Error('Failed to create template');
  }
  return response.json();
}

export async function updateTemplate(id, template) {
  const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(template)
  });
  if (!response.ok) {
    throw new Error('Failed to update template');
  }
  return response.json();
}

export async function deleteTemplate(id) {
  const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete template');
  }
  return response.json();
}

export async function downloadSinglePDF(templateName, templateBody, loan) {
  const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template_name: templateName,
      template_body: templateBody,
      loan
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Format filename as specified: {notice_letter_name}_{loan_no}.pdf
  const cleanName = templateName.replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `${cleanName}_${loan.loan_no}.pdf`;
  
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
