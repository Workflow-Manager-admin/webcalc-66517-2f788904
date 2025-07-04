import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * DivisionGame - An interactive arithmetic game for practicing division.
 * - Randomly generates two numbers for an integer division problem (clean division).
 * - User inputs answer, receives feedback, and moves to next problem.
 * UI follows the app's card layout and theme.
 */
// PUBLIC_INTERFACE
function DivisionGame({ onClose }) {
  // Generate a division problem with integer result
  const generateProblem = () => {
    const min = 2, max = 12; // Reasonable small table
    const divisor = Math.floor(Math.random() * (max - min + 1)) + min;
    const quotient = Math.floor(Math.random() * (max - min + 1)) + min;
    const dividend = divisor * quotient;
    return { dividend, divisor, quotient };
  };

  // State for problem, input, feedback, and score
  const [problem, setProblem] = useState(generateProblem());
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(null); // null, true, false
  const [streak, setStreak] = useState(0);

  // Called when the user submits an answer
  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = Number(userInput) === problem.quotient;
    setSuccess(correct);
    if (correct) {
      setFeedback("✅ Correct!");
      setStreak((s) => s + 1);
      // Show next problem after short delay
      setTimeout(() => {
        setProblem(generateProblem());
        setUserInput("");
        setFeedback("");
        setSuccess(null);
      }, 850);
    } else {
      setFeedback("❌ Wrong. Try again!");
      setStreak(0);
    }
  };

  // Input handling: allow only numbers
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setUserInput(value);
    setFeedback("");
    setSuccess(null);
  };

  // Keyboard: enter to submit
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") {
        document.getElementById("division-submit-btn")?.click();
      }
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, []);

  return (
    <div
      className="calc-outer"
      tabIndex={-1}
      aria-label="Division Game"
      style={{
        background: "var(--card-bg)",
        color: "var(--button-font)",
        boxShadow: "0 2px 24px var(--card-shadow)",
        borderRadius: "18px",
        padding: "2rem 1.5rem",
        minWidth: "320px",
        maxWidth: "340px",
        width: "90vw",
        margin: "64px auto",
        border: "1.5px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <button
        aria-label="Close Division Game"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 15,
          right: 19,
          background: "none",
          border: "none",
          color: "var(--secondary)",
          fontSize: "1.25rem",
          cursor: "pointer",
          zIndex: 10,
        }}
        title="Back to Main Menu"
      >
        &larr;
      </button>
      <h2
        className="calc-title"
        style={{
          color: "var(--primary)",
          fontWeight: 700,
          marginBottom: "0.55rem",
          textAlign: "center",
          letterSpacing: ".04em",
        }}
      >
        Division Game
      </h2>
      <div className="calc-display" style={{ textAlign: "center", fontSize: "1.4rem", marginBottom: 25 }}>
        {problem.dividend} <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1.6rem" }}>&divide;</span> {problem.divisor} = ?
      </div>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <input
          type="text"
          autoFocus
          className="calc-btn"
          style={{
            minWidth: 75,
            fontSize: "1.45rem",
            padding: "8px 10px",
            marginBottom: 7,
            marginRight: 7,
            outline: success === null ? "none" : success ? "2px solid var(--accent)" : "2px solid var(--primary)",
            transition: "outline 0.15s"
          }}
          aria-label="Your answer"
          inputMode="numeric"
          value={userInput}
          onChange={handleInputChange}
          disabled={success === true}
        />
        <button
          id="division-submit-btn"
          type="submit"
          className="calc-btn btn-eq"
          style={{ fontSize: "1.21rem", minWidth: 58, fontWeight: 600, marginBottom: 7 }}
          disabled={userInput === "" || success === true}
        >
          Submit
        </button>
      </form>
      {feedback && (
        <div
          style={{
            color: success ? "var(--accent)" : "var(--primary)",
            fontWeight: 500,
            fontSize: "1.12rem",
            minHeight: "1.5em",
            textAlign: "center",
            marginTop: 5,
            marginBottom: 3,
            transition: "color 0.2s",
          }}
          aria-live="polite"
        >
          {feedback}
        </div>
      )}
      <div style={{
        color: "var(--secondary)",
        fontSize: 12,
        margin: "5px 0 0 0",
        textAlign: "center"
      }}>
        Streak: <span style={{ color: "var(--accent)", fontWeight: 600 }}>{streak}</span>
      </div>
      <footer
        style={{
          marginTop: "1.4rem",
          color: "var(--secondary)",
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        <span style={{ color: "var(--accent)", fontWeight: 600 }}>Division Practice</span>
        &nbsp;•&nbsp; Modern UI
      </footer>
    </div>
  );
}

export default DivisionGame;
