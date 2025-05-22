import { useState, useEffect } from "react";
import './App.css';

export default function EnhancedCppEditor() {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main()
{
    int divisor, dividend, quotient, remainder;

    cout << "Enter dividend: ";
    cin >> dividend;

    cout << "Enter divisor: ";
    cin >> divisor;

    // Add error handling for division by zero
    if (divisor == 0) {
        cout << "Error: Cannot divide by zero!" << endl;
        return 1;
    }

    quotient = dividend / divisor;
    remainder = dividend % divisor;

    cout << "Quotient = " << quotient << endl;
    cout << "Remainder = " << remainder << endl;

    return 0;
}`);

  const [input, setInput] = useState(`20
3`);

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    // Load preferences from localStorage if available
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedFontSize = localStorage.getItem("fontSize");
    
    if (savedDarkMode) setDarkMode(savedDarkMode === "true");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("fontSize", fontSize);
  }, [darkMode, fontSize]);

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");
    
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, input }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (error) {
      setOutput(`Error: ${error.message}. Make sure the server is running.`);
    } finally {
      setLoading(false);
    }
  };

  const resetCode = () => {
    if (window.confirm("Reset code to default?")) {
      setCode(`#include <iostream>
using namespace std;

int main()
{
    int divisor, dividend, quotient, remainder;

    cout << "Enter dividend: ";
    cin >> dividend;

    cout << "Enter divisor: ";
    cin >> divisor;

    // Add error handling for division by zero
    if (divisor == 0) {
        cout << "Error: Cannot divide by zero!" << endl;
        return 1;
    }

    quotient = dividend / divisor;
    remainder = dividend % divisor;

    cout << "Quotient = " << quotient << endl;
    cout << "Remainder = " << remainder << endl;

    return 0;
}`);
    }
  };

  const handleKeyDown = (e) => {
    // Add Tab support for code editor
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <div className="header">
          <h1>C++ Code Editor</h1>
          <div className="header-controls">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-primary"
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <div className="font-controls">
              <button 
                onClick={() => setFontSize(prev => Math.max(10, prev - 2))}
                className="btn btn-secondary"
                disabled={fontSize <= 10}
                title="Decrease font size"
              >
                A-
              </button>
              <span className="font-size-display">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                className="btn btn-secondary"
                disabled={fontSize >= 24}
                title="Increase font size"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">💻 Code Editor</h2>
              <button 
                onClick={resetCode} 
                className="btn btn-warning"
                title="Reset to default code"
              >
                🔄 Reset
              </button>
            </div>
            <textarea
              className="code-editor"
              style={{ fontSize: `${fontSize}px` }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your C++ code here..."
              spellCheck="false"
            />
          </div>

          <div className="section">
            <div className="section">
              <h2 className="section-title">📥 Program Input</h2>
              <textarea
                className="input-area"
                style={{ fontSize: `${fontSize}px` }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter program input here (one value per line)..."
                spellCheck="false"
              />
              <button 
                onClick={runCode} 
                disabled={loading}
                className={`btn btn-success btn-full ${loading ? 'loading' : ''}`}
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? "Running..." : "▶ Run Code"}
              </button>
            </div>
          
            <div className="section">
              <h2 className="section-title">📤 Output</h2>
              <pre 
                className="output-area"
                style={{ fontSize: `${fontSize}px` }}
              >
                {output || "No output yet. Click 'Run Code' to execute your program."}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="status-bar">
          {darkMode ? "🌙 Dark mode enabled" : "☀ Light mode enabled"} • 
          Font size: {fontSize}px • 
          Ready to compile C++ code
        </div>
      </div>
    </div>
  );
}