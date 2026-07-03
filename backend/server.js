const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const templateRoutes = require('./routes/templateRoutes');
const { generatePdf } = require('./controllers/templateController');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mount Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/templates', templateRoutes);

// Stream PDF Endpoint
app.post('/api/generate-pdf', generatePdf);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
