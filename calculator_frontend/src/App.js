import React, { useState, useEffect } from "react";
import "./App.css";
import AdditionGame from "./AdditionGame";
import DivisionGame from "./DivisionGame";

/**
 * Color variables for the calculator app (matches provided theme).
 */
const THEME_COLORS = {
  primary: "#1976d2", // blue
  secondary: "#424242", // dark grey
  accent: "#ff9800", // orange
  cardBg: "#fff",
  cardShadow: "rgba(25, 118, 210, 0.1)",
  border: "#e0e0e0",
  displayBg: "#f8f9fa",
  buttonBg: "#f8f9fa",
  font: "#212121",
  fontSecondary: "#424242",
};

/**
 * Calculator Display component: Purely presentational, displays current input/result.
 * @param {string} value - Current display value
 */
function CalculatorDisplay({ value }) {
  return (
    <div className="calc-display" data-testid="calc-display">
      {value}
    </div>
  );
}

/**
 * Calculator Button component: Handles accessible UI and click action.
 * @param {object} props
 */
function CalculatorButton({ label, onClick, className, ...rest }) {
  return (
    <button
      className={`calc-btn ${className || ""}`}
      onClick={onClick}
      {...rest}
    >
      {label}
    </button>
  );
}

/**
 * Calculator Keypad component: Renders buttons for digits, operators, clear, and equals.
 * Accepts callbacks for each button click event.
 */
function CalculatorKeypad({ onButtonPress }) {
  // Define calculator buttons layout
  const buttons = [
    { label: "C", type: "clear", className: "btn-clear" },
    { label: "÷", type: "operator", value: "/", className: "btn-op" },
    { label: "×", type: "operator", value: "*", className: "btn-op" },
    { label: "−", type: "operator", value: "-", className: "btn-op" },
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "+", type: "operator", value: "+", className: "btn-op" },
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "=", type: "equal", className: "btn-eq" },
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "0", type: "number", className: "btn-zero" },
    { label: ".", type: "dot" }
  ];

  return (
    <div className="calc-keypad">
      {buttons.map((btn, idx) => (
        <CalculatorButton
          key={btn.label + idx}
          label={btn.label}
          className={btn.className}
          onClick={() => onButtonPress(btn)}
          aria-label={btn.label}
        />
      ))}
    </div>
  );
}

/**
 * Parse and evaluate the arithmetic expression safely.
 * Only supports +, -, *, / operations and numbers.
 */
// PUBLIC_INTERFACE
function safeEvaluate(expression) {
  /**
   * This parser only allows numbers, basic arithmetic operations, and decimals.
   * We use Function constructor for evaluation, but strip unsafe characters.
   * In production, a real parser (not eval/function) or a library would be recommended.
   */
  try {
    // Replace unicode operators with JS operators
    let expr = expression
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/−/g, "-");

    // Validate the expression: only digits, operators, parentheses, decimals, and spaces allowed
    if (!/^[\d+\-*/. ()]+$/.test(expr)) return "Err";

    // eslint-disable-next-line no-new-func
    // Calculate the result
    // Use Function constructor as a simple fallback for basic arithmetic (no variables)
    // To avoid security risk, ensure regex above is strict
    // Note: will throw on malformed expressions
    // For more robustness, integrate an expression parser
    const result = Function(`"use strict"; return (${expr})`)();
    // Prevent divide by zero
    if (!isFinite(result)) return "Err";
    return result.toString();
  } catch (e) {
    return "Err";
  }
}

/**
 * Main Calculator Card component.
 * Handles state and logic for input, results, and rendering.
 */
// PUBLIC_INTERFACE
function Calculator() {
  // State for input and history/result
  const [display, setDisplay] = useState("0");
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Button click handler
  const handleButtonPress = (btn) => {
    if (btn.type === "number") {
      setDisplay((prev) => {
        // Replace 0 on new input, otherwise append
        if (prev === "0" || waitingForOperand) {
          setWaitingForOperand(false);
          return btn.label;
        }
        return prev + btn.label;
      });
    } else if (btn.type === "dot") {
      setDisplay((prev) => {
        // Only allow one dot per operand
        const parts = prev.split(/[\+\-\*\/]/);
        const last = parts[parts.length - 1];
        if (last.includes(".")) return prev; // ignore multiple dots
        return prev + ".";
      });
    } else if (btn.type === "operator") {
      setDisplay((prev) => {
        // Prevent two operators in a row
        if (
          /[\+\-\*\/]$/.test(prev) &&
          prev.length > 0
        ) {
          // replace last operator
          return prev.slice(0, -1) + btn.value;
        }
        return prev + btn.value;
      });
      setWaitingForOperand(false);
    } else if (btn.type === "equal") {
      setDisplay((prev) => {
        const result = safeEvaluate(prev);
        setWaitingForOperand(true);
        return result;
      });
    } else if (btn.type === "clear") {
      setDisplay("0");
      setWaitingForOperand(false);
    }
  };

  return (
    <main
      className="calc-outer"
      tabIndex={-1}
      aria-label="Calculator"
      style={{
        background: THEME_COLORS.cardBg,
        color: THEME_COLORS.font,
        boxShadow: `0 2px 24px ${THEME_COLORS.cardShadow}`,
        borderRadius: "18px",
        padding: "2rem 1.5rem",
        minWidth: "320px",
        maxWidth: "340px",
        width: "90vw",
        margin: "64px auto",
        border: `1.5px solid ${THEME_COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <h2
        className="calc-title"
        style={{
          color: THEME_COLORS.primary,
          fontWeight: 700,
          marginBottom: "0.5rem",
          textAlign: "center",
          letterSpacing: ".04em"
        }}
      >
        Calculator
      </h2>
      <CalculatorDisplay value={display} />
      <CalculatorKeypad onButtonPress={handleButtonPress} />
      <footer
        style={{
          marginTop: "1.5rem",
          color: THEME_COLORS.secondary,
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        <span style={{ color: THEME_COLORS.accent, fontWeight: 600 }}>Modern UI</span>
        &nbsp;•&nbsp; Kavia WebCalc
      </footer>
    </main>
  );
}

/**
 * App component and theme injection.
 * Wraps the Calculator in a full-viewport light background and centers it.
 */
/**
 * Top-level App with toggle between Calculator and AdditionGame.
 */
/**
 * Top-level App with toggle between Calculator, AdditionGame and DivisionGame.
 */
// PUBLIC_INTERFACE
function App() {
  useEffect(() => {
    // Ensure theme is light as required
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // view: "calc", "add", "div"
  const [view, setView] = useState("calc");

  // Render top-level toggle
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      {view === "calc" && (
        <div style={{ position: "relative", width: "100%" }}>
          <Calculator />
          <div style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 11,
            display: "flex",
            gap: 8
          }}>
            <button
              className="calc-btn btn-op"
              style={{
                minWidth: "80px",
                fontSize: "1.04rem",
                fontWeight: 500,
                border: "1px solid var(--accent)",
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 1px 6px var(--card-shadow)",
                padding: "7px 14px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => setView("add")}
              aria-label="Practice Addition Game"
            >
              + Game
            </button>
            <button
              className="calc-btn btn-op"
              style={{
                minWidth: "80px",
                fontSize: "1.04rem",
                fontWeight: 500,
                border: "1px solid var(--primary)",
                background: "var(--primary)",
                color: "#fff",
                boxShadow: "0 1px 6px var(--card-shadow)",
                padding: "7px 14px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => setView("div")}
              aria-label="Practice Division Game"
            >
              &divide; Game
            </button>
          </div>
        </div>
      )}
      {view === "add" && (
        <AdditionGame onClose={() => setView("calc")} />
      )}
      {view === "div" && (
        <DivisionGame onClose={() => setView("calc")} />
      )}
    </div>
  );
}

export default App;
