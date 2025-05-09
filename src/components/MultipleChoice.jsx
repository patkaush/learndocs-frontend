import React, { useState, useEffect } from 'react';

const buttonStyle = {
  padding: '10px 16px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  background: '#f0f0f0',
  cursor: 'pointer'
};

const MultipleChoice = ({ chatId, query }) => {
  const [mcqData, setMcqData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId || !query) return;

    setLoading(true);
    fetch(`http://localhost:8000/chat/${chatId}/mcqs?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setMcqData(data);
        setCurrentIndex(0);
        setSelected(null);
        setShowFeedback(false);
        setCompleted(false);
        setScore(0);
      })
      .catch(err => console.error("Failed to fetch MCQs:", err))
      .finally(() => setLoading(false));
  }, [chatId, query]);

  const currentQuestion = mcqData[currentIndex];

  const handleOptionClick = (index) => {
    if (selected !== null || completed) return;
    setSelected(index);
    setShowFeedback(true);
    if (currentQuestion.options[index].option === currentQuestion.correct_option) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < mcqData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setCompleted(false);
    setScore(0);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>⏳ Loading questions...</div>;
  }

  if (!mcqData.length) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>❗ No multiple-choice questions available.</div>;
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>✅ You've completed all the questions!</h2>
        <p>Your score: {score} / {mcqData.length}</p>
        <p>Would you like to try again or go for a new set?</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleReset} style={buttonStyle}>🔁 Repeat Questions</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
      <h2 style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '30px' }}>{currentQuestion.question}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentQuestion.options.map((opt, idx) => {
          const isCorrect = selected !== null && opt.option === currentQuestion.correct_option;
          const isSelected = selected === idx;
          return (
            <div
              key={idx}
              onClick={() => handleOptionClick(idx)}
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: isSelected ? (isCorrect ? '#d4edda' : '#f8d7da') : '#fff',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                cursor: selected === null ? 'pointer' : 'default',
                border: isSelected ? (isCorrect ? '2px solid #28a745' : '2px solid #dc3545') : '1px solid #ddd',
              }}
            >
              {opt.text}
            </div>
          );
        })}
      </div>
      {showFeedback && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={handleNext} style={buttonStyle}>➡️ Next Question</button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;
