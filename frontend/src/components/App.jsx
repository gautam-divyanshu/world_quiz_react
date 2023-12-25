import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [wasCorrect, setWasCorrect] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/");
        setQuestion(response.data.question.country); // Assuming the country is the question
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/submit", {
        answer: answer,
      });

      // Handle the response from the backend
      const responseData = response.data;

      // Update the state based on the received data
      setQuestion(responseData.question.country);
      setAnswer(""); // Clear the answer input field if needed
      setTotalScore(responseData.totalScore);
      setWasCorrect(responseData.wasCorrect);
      if (responseData.wasCorrect === false) {
        alert(`Game over! Final best score: ${totalScore}`);
        
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <>
      <form className="container" onSubmit={handleSubmit} method="post">
        <div className="horizontal-container">
          <h3>Total Score: {totalScore}</h3>
        </div>

        <h1 id="countryName">{question}</h1>

        <div className="answer-container">
          <input
            type="text"
            name="answer"
            id="userInput"
            placeholder="Enter the capital"
            autoFocus
            autoComplete="off"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          />
        </div>
        <button type="submit">
        Submit
        {wasCorrect ? (
          <span className="checkmark">✔</span>
        ) : wasCorrect === false ? (
          <>
            <span className="cross" id="error">
              ✖
            </span>
            <a href="/" className="restart-button">
              Restart
            </a>
          </>
        ) : null}
      </button>
      </form>
    </>
  );
};

export default App;
