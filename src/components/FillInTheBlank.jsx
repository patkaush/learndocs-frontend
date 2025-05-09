import React, { useState, useEffect } from 'react';

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
};

const FillInTheBlank = ({ chatId, query }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const current = questions[currentIndex];
  const isCorrect = current && input.trim().toLowerCase() === current.answer.toLowerCase();

  useEffect(() => {
    if (!chatId || !query) return;

    setLoading(true);
    fetch(`http://localhost:8000/chat/${chatId}/fibs?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setCurrentIndex(0);
        setScore(0);
        setInput('');
        setSubmitted(false);
        setCompleted(false);
      })
      .catch(err => console.error("Failed to fetch fill-in-the-blanks:", err))
      .finally(() => setLoading(false));
  }, [chatId, query]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    setInput('');
    setSubmitted(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setInput('');
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>⏳ Loading questions...</div>;
  }

  if (!questions.length) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>❗ No fill-in-the-blank questions available.</div>;
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>✅ You've completed all the questions!</h2>
        <p>Your score: {score} / {questions.length}</p>
        <p>Would you like to try again or go for a new set?</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleReset} style={buttonStyle}>🔁 Repeat</button>
          {/* Optional New Set button */}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '30px' }}>
      <h2 style={{ color: '#007bff' }}>{current.sentence_with_blank}</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '20px' }}
        placeholder="Your answer"
      />
      {!submitted ? (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSubmit} style={buttonStyle}>📤 Submit</button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: isCorrect ? '#28a745' : '#dc3545' }}>
            {isCorrect ? '✅ Correct!' : `❌ Incorrect. Correct answer: ${current.answer}`}
          </p>
          <button onClick={handleNext} style={buttonStyle}>➡️ Next</button>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
