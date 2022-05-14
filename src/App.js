import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [word, setWord] = useState({});
  const [myWord, setMyWord] = useState({});
  const [attempt, setAttempt] = useState(0);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [endMessage, setEndMessage] = useState("You Lost! No points");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    callFirstWord();
  }, []);

  const callFirstWord = async () => {
    const { data } = await axios.get("http://localhost:8080");
    setWord(data);
  };

  const tryAgain = () => {
    setAttempt(0);
    setWord({});
    setMyWord({});
    setGameActive(true);
    setEndMessage("");
    callFirstWord();
  };

  const revealAnswer = async () => {
    setGameActive(false);
    const { data } = await axios.post("http://localhost:8080/reveal", {
      id: word.id,
    });
    setWord(data);
    setEndMessage("You lost!");
  };

  const win = () => {
    const points = 3 - attempt;
    setGameActive(false);
    setEndMessage(`You Won!! you get ${points} points `);
    setScore(score + points);
    setWord({ text: myWord });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const obj = { text: myWord, id: word.id };
    try {
      const response = await axios.post("http://localhost:8080", obj);
      win();
    } catch (er) {
      if (attempt === 2) {
        revealAnswer();
      }
    }
    setAttempt(attempt + 1);
  };

  const handleChange = async (event) => {
    const val = event.target.value;
    if (val.length > word.masked.length) {
      setInputError("Word too long!!");
    } else {
      setMyWord(val);
      setInputError("");
    }
  };

  return (
    <div align="center">
      <h3>Score {score}</h3>
      <div>
        <li>1st Attempt: 3 points</li>
        <li>2nd Attempt: 2 points</li>
        <li>3nd Attempt: 1 point</li>
        <li>After that: 0 point and word is revealed</li>
      </div>

      <br />
      {gameActive && (
        <div>
          <h2>{word.masked}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} />
            <input type="submit" value="Submit" disabled={inputError} />
            <p>{inputError}</p>
          </form>
        </div>
      )}
      {!gameActive && (
        <div>
          <h2>{word.text}</h2>
          <p>{endMessage}</p>
          <input type="submit" value="Try Again!" onClick={tryAgain} />
        </div>
      )}
    </div>
  );
}

export default App;
