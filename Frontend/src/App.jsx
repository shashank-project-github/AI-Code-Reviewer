import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import logo from "./assets/logo.svg";

function App() {
  const [count, setCount] = useState(0)
  const placeholderText = "Paste your code here...";
  const [code, setCode] = useState(placeholderText);

  const [review, setReview] = useState(``)
  // 1. ADDED LOADING STATE HERE
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    // 2. SET LOADING TO TRUE AND CLEAR PREVIOUS REVIEW
    setLoading(true)
    setReview(``)

    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      console.error("Error getting review:", error)
      setReview(`Failed to fetch review. Please try again.`)
    } finally {
      // 3. TURN OFF LOADING ONCE DONE (REGARDLESS OF SUCCESS OR FAILURE)
      setLoading(false)
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <a href="/">AI Code Reviewer</a>
        </div>
      </nav>
      <main>
        <div className="left">
          <div className="code">
            <div className="code">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                onFocus={() => {
                  if (code === placeholderText) {
                    setCode("");
                  }
                }}
                highlight={(code) =>
                  prism.highlight(code, prism.languages.javascript, "javascript")
                }
                padding={15}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 16,
                  border: "1px solid black",
                  borderRadius: "1rem",
                  height: "100%",
                  width: "100%"
                }}
              />
            </div>
          </div>
          <div
            onClick={reviewCode}
            className="review">Review Code</div>
        </div>

        <div className="right">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              {/* Injecting keyframes safely into the document */}
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 0.6; }
                  50% { opacity: 1; }
                }
              `}</style>

              {/* Animated Spinner Circle */}
              <div style={{
                width: "35px",
                height: "35px",
                border: "3px solid rgba(77, 166, 255, 0.2)",
                borderTop: "3px solid #4da6ff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }}></div>

              {/* Pulsing Text */}
              <p style={{
                color: "#4da6ff",
                fontSize: "16px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                animation: "pulse 1.5s ease-in-out infinite"
              }}>
                AI is analyzing your code...
              </p>
            </div>
          ) : review ? (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          ) : (
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic" }}>
              Your code review will show here .......
            </p>
          )}
        </div>
      </main>
    </>
  )
}

export default App