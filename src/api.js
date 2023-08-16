require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const pg = require("pg");
const cors = require("cors");
const app = express();

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

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);

//to debug locally
// app.listen(3000, () => {
//   console.log("running");
// });
