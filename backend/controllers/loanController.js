const { LOANS_FILE, readDataFile } = require('../utils/db');

const getLoans = (req, res) => {
  const loans = readDataFile(LOANS_FILE, []);
  res.json(loans);
};

module.exports = {
  getLoans
};
