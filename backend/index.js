import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

const app = express();
app.use(cors());
//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const port = 5000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "tanmay@123",
  port: 5432,
});

db.connect();

let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "New York" },
];

db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("error executing query", err.stack);
  } else {
    quiz = res.rows;
  }
  db.end();
});

let totalCorrect = 0;
let currentQuestion = {};

app.get("/", async (req, res) => {
  try {
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.json({ question: currentQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.json({
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
