require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const rootRouter = require("./routes/root");
const blogRouter = require("./routes/blog");
const emailRouter = require("./routes/email");
const serverless = require("serverless-http");

app.use(express.json());
app.use(cors());
app.use("/.netlify/functions/api", rootRouter);
app.use("/.netlify/functions/api/blog", blogRouter);
app.use("/.netlify/functions/api/email", emailRouter);

// module.exports.handler = serverless(app);

//to debug locally
app.listen(3000, () => {
  console.log("running");
});
