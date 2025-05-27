import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [mode, setMode] = useState("basic");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Audio handlers
  const handleButtonHover = () => {
    const audio = new window.Audio("/hover.mp3");
    audio.playbackRate = 0.9 + Math.random() * 0.2;
    audio.volume = 0.3;
    audio.play();
  };

  const handleButtonClick = (val) => {
    const audio = new window.Audio("/select.mp3");
    audio.volume = 0.5;
    audio.play();
    handleCalculatorInput(val);
  };

  const handleSelectorHover = () => {
    const audio = new window.Audio("/hover.mp3");
    audio.playbackRate = 0.9 + Math.random() * 0.2;
    audio.volume = 0.5;
    audio.play();
  };

  const handleSelectorClick = (selectedMode) => {
    const audio = new window.Audio("/select.mp3");
    audio.volume = 0.5;
    audio.play();
    setMode(selectedMode);
  };

  // Calculator logic
  const handleCalculatorInput = (val) => {
    if (val === "AC") {
      setValue("");
    } else if (val === "=") {
      try {
        const result = eval(value).toString();
        setValue(result);
        setHistory(prev => [
          { expression: value, result },
          ...prev.slice(0, 9) // keep only last 10 entries
        ]);
      } catch {
        setValue("Error");
      }
    } else if (val === "sin") {
      setValue(Math.sin(Number(value)).toString());
    } else if (val === "cos") {
      setValue(Math.cos(Number(value)).toString());
    } else if (val === "tan") {
      setValue(Math.tan(Number(value)).toString());
    } else if (val === "log") {
      setValue(Math.log10(Number(value)).toString());
    } else if (val === "√") {
      setValue(Math.sqrt(Number(value)).toString());
    } else if (val === "^") {
      setValue(value + "**");
    } else {
      setValue(value + val);
    }
  };

  // Button configurations
  const basicButtons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
    "AC"
  ];

  const scientificButtons = [
    "sin", "cos", "tan", "log",
    "(", ")", "^", "√",
    ...basicButtons
  ];

  return (
    <div className="container">
      <div className="controls">
        <button
          className="theme-toggle"
          onClick={() => {
            const audio = new window.Audio("/click.mp3");
            audio.play();
            setIsDark(prev => !prev);
          }}
        >
          {isDark ? "🌙 Dark" : "🔆 Light"}
        </button>
        <div className="mode-selector">
          <button
            className={mode === "basic" ? "active" : ""}
            onMouseEnter={handleSelectorHover}
            onClick={() => handleSelectorClick("basic")}
          >
            Basic
          </button>
          <button
            className={mode === "scientific" ? "active" : ""}
            onMouseEnter={handleSelectorHover}
            onClick={() => handleSelectorClick("scientific")}
          >
            Scientific
          </button>
        </div>
        <button
          className="history-toggle"
          onClick={() => setShowHistory(prev => !prev)}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      <div className="calculator">
        <input
          type="text"
          value={value}
          readOnly
          className="display"
          placeholder="0"
        />

        <div className="buttonBox">
          {(mode === "basic" ? basicButtons : scientificButtons).map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              onMouseEnter={handleButtonHover}
              className={btn === "AC" ? "reset" : ""}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div className={`history-tab${showHistory ? " open" : ""}`}>
        {showHistory && (
          <>
            <h3>History</h3>
            <ul>
              {history.length === 0 && <li>No history yet.</li>}
              {history.map((item, idx) => (
                <li key={idx}>
                  <span className="history-expression">{item.expression}</span>
                  {" = "}
                  <span className="history-result">{item.result}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
