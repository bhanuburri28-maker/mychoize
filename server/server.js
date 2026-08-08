const app = require('./app');
const { PORT } = require('./config/config');

app.listen(PORT, () => {
  console.log(`MyChoize backend running on http://localhost:${PORT}`);
});
