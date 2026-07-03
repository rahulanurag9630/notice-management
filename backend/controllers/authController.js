const login = (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'password123') {
    return res.json({ success: true, token: 'mock-token-12345' });
  }
  
  return res.status(401).json({ success: false, message: 'Invalid username or password' });
};

module.exports = {
  login
};
