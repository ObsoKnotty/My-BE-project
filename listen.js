const { PORT = 9090 } = process.env;
const app = require("./app_connections/app");

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
