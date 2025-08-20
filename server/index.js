const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const blockchainRoutes = require('./services/blockchainData');
const aiRoutes = require('./services/aiRiskScorer');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('On-Chain Credit Score API running...');
});

app.use('/api/blockchain', blockchainRoutes);
app.use('/api/ai', aiRoutes);

// ✅ Export app for Vercel
module.exports = app;

// 👇 Only run locally if not on Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
