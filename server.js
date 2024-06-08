const redis = require("redis");
const app = require("./app/app.js");

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
