// server.js
import express from 'express';
import { quora } from './scripts/quora.js';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/quora', async (req, res) => {
  const { entityPath, contentPath } = req.body;

  try {
    await quora(entityPath, contentPath);
    res.status(200).send('✅ Run completed successfully!');
  } catch (err) {
    res.status(500).send(`❌ Run failed: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
