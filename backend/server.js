const express = require("express");
const cors = require("cors");
const router = require("./router.js");
const auth = require("./auth.js");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", auth);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
