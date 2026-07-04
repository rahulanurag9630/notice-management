const PDFDocument = require('pdfkit');
const { TEMPLATES_FILE, readDataFile, writeDataFile } = require('../utils/db');

const getTemplates = (req, res) => {
  const templates = readDataFile(TEMPLATES_FILE, []);
  res.json(templates);
};

const createTemplate = (req, res) => {
  const { name, body } = req.body;
  if (!name || !body) {
    return res.status(400).json({ error: 'Name and body are required' });
  }

  const templates = readDataFile(TEMPLATES_FILE, []);
  const newTemplate = {
    id: 'tpl_' + Date.now(),
    name,
    body
  };

  templates.push(newTemplate);
  writeDataFile(TEMPLATES_FILE, templates);
  res.status(201).json(newTemplate);
};

const updateTemplate = (req, res) => {
  const { id } = req.params;
  const { name, body } = req.body;

  const templates = readDataFile(TEMPLATES_FILE, []);
  const index = templates.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }

  templates[index] = {
    ...templates[index],
    name: name || templates[index].name,
    body: body !== undefined ? body : templates[index].body
  };

  writeDataFile(TEMPLATES_FILE, templates);
  res.json(templates[index]);
};

const deleteTemplate = (req, res) => {
  const { id } = req.params;
  let templates = readDataFile(TEMPLATES_FILE, []);
  const filtered = templates.filter(t => t.id !== id);

  if (templates.length === filtered.length) {
    return res.status(404).json({ error: 'Template not found' });
  }

  writeDataFile(TEMPLATES_FILE, filtered);
  res.json({ success: true, message: 'Template deleted' });
};

// Merges template placeholders with actual loan details
function compileTemplate(body, data) {
  let result = body;
  const placeholders = ['borrower_name', 'loan_no', 'outstanding_amount', 'due_date', 'address', 'email', 'phone'];
  placeholders.forEach(key => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, data[key] || '');
  });
  return result;
}

const generatePdf = (req, res) => {
  const { template_name, template_body, loan } = req.body;

  if (!template_body || !loan || !loan.loan_no) {
    return res.status(400).json({ error: 'Missing required parameters: template_body or loan details' });
  }

  const compiledText = compileTemplate(template_body, loan);
  const cleanName = (template_name || 'Notice').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${cleanName}_${loan.loan_no}.pdf`;

  try {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);
    doc.fontSize(12).font('Helvetica').text(compiledText, {
      align: 'left',
      lineGap: 4
    });
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  generatePdf
};
