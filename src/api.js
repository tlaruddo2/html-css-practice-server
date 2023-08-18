require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const pg = require("pg");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
  },
});

app.use(express.json());
app.use(cors());

const credentials = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  post: process.env.DB_PORT,
  ssl: process.env.DB_SSL,
};

console.log("credential", credentials);
const pool = new pg.Pool(credentials);

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi",
  });
});

router.get("/blog", (req, res) => {
  pool.query("SELECT * FROM blog", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
});

router.post("/blog", (req, res) => {
  const postBlog =
    "INSERT INTO blog (category, title, content, author) VALUES ($1, $2, $3, $4) RETURNING id; ";
  const { category, title, content, author } = req.body;
  pool.query(postBlog, [category, title, content, author], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
});

router.delete("/blog/:id", (req, res) => {
  const deleteBlogById = "DELETE FROM blog WHERE id = $1 RETURNING *;";
  const id = req.params.id;
  pool.query(deleteBlogById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.row);
  });
});

router.put("/blog/:id", (req, res) => {
  const updateBlogById =
    "UPDATE blog SET content = $1 WHERE id = $2 RETURNING *;";
  const id = req.params.id;
  const { content } = req.body;
  pool.query(updateBlogById, [content, id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.row);
  });
});

router.post("/email", (req, res) => {
  const { from, subject, text } = req.body;
  const mailOptions = {
    from: "tlaruddo2test@gmail.com",
    to: "tlaruddo2@gmail.com",
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      res.status(200).send(info.response);
    }
  });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);

//to debug locally
// app.listen(3000, () => {
//   console.log("running");
// });
