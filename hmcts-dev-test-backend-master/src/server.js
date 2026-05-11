const { loadEnv } = require('./config/env');
const { createApp } = require('./app');

const env = loadEnv();
const app = createApp(env);

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
});
