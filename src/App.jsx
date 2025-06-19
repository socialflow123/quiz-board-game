import { useState, useEffect } from "react";
import questions from "./data/questions.json";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const current = shuffledQuestions[currentIndex];

  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (currentIndex === shuffledQuestions.length - 1 && showFeedback === "정답입니다!") {
      setTimeout(() => {
        setEndTime(Date.now());
      }, 1000);
    }
  }, [currentIndex, showFeedback, shuffledQuestions.length]);

  const handleAnswer = (selected) => {
    const isCorrect =
      current.type === "choice"
        ? selected === current.answer
        : selected === current.answer;

    if (isCorrect) {
      setShowFeedback("정답입니다!");
      setTimeout(() => {
        setShowFeedback(null);
        setCurrentIndex((prev) => Math.min(prev + 1, shuffledQuestions.length));
      }, 1000);
    } else {
      setShowFeedback("틀렸습니다. 처음부터 다시 시작합니다!");
      setTimeout(() => {
        setShowFeedback(null);
        setCurrentIndex(0);
      }, 1500);
    }
  };

  const getElapsedTime = () => {
    if (!endTime) return null;
    const duration = endTime - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  };

  if (currentIndex >= shuffledQuestions.length) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: "28px",
        textAlign: "center",
        padding: "40px"
      }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>🎉 완료했습니다!</h1>
        {endTime && (
          <p style={{ marginTop: "24px" }}>
            ⏱ 문제 푸는 데 걸린 시간: <strong>{getElapsedTime()}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fdfdfd",
      position: "relative"
    }}>
      {showFeedback?.includes("틀렸습니다") && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "200px",
            color: "red",
            fontWeight: "bold",
            pointerEvents: "none",
            zIndex: 999
          }}
        >
          ❌
        </div>
      )}

      <div style={{
        width: "100%",
        maxWidth: "1400px",
        padding: "60px",
        fontSize: "28px",
        lineHeight: "1.8",
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "30px"
        }}>
          🌍 퀴즈 보드게임
        </h1>

        <p style={{ fontWeight: "600", marginBottom: "20px" }}>
          {currentIndex + 1}번 문제: {current.question}
        </p>

        {current.image && (
          <img
            src={current.image}
            alt="문제 이미지"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              marginBottom: "30px",
              borderRadius: "16px",
              border: "2px solid #ccc"
            }}
          />
        )}

        {current.type === "choice" ? (
          current.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              style={{
                display: "block",
                width: "100%",
                margin: "16px 0",
                padding: "24px",
                fontSize: "24px",
                border: "2px solid #999",
                borderRadius: "12px",
                cursor: "pointer",
                background: "#f4f4f4",
                textAlign: "left"
              }}
            >
              {idx + 1}. {choice}
            </button>
          ))
        ) : (
          <div style={{ marginTop: "30px" }}>
            <button
              onClick={() => handleAnswer(true)}
              style={{
                fontSize: "36px",
                marginRight: "40px",
                padding: "20px 60px",
                cursor: "pointer",
              }}
            >
              O
            </button>
            <button
              onClick={() => handleAnswer(false)}
              style={{
                fontSize: "36px",
                padding: "20px 60px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        )}

        {showFeedback && (
          <p
            style={{
              marginTop: "40px",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#222",
              textAlign: "center"
            }}
          >
            {showFeedback}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
