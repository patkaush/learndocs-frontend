import React, { useState, useEffect } from 'react';

const buttonStyle = {
  padding: '10px 16px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  background: '#f0f0f0',
  cursor: 'pointer'
};

const WritingMode = ({ chatId, query }) => {
  const [qas, setQAs] = useState([]);   // ✅ Store full question-answer pairs
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);  // ✅ track result
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId || !query) return;

    setLoading(true);
    fetch(`http://localhost:8000/chat/${chatId}/qas?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setQAs(data);
        setCurrentIndex(0);
        setResponse('');
        setSubmitted(false);
        setCorrect(null);
      })
      .catch(err => console.error("Failed to fetch writing prompts:", err))
      .finally(() => setLoading(false));
  }, [chatId, query]);

  const handleSubmit = () => {
    setSubmitted(true);
    const correctAnswer = qas[currentIndex].answer.trim().toLowerCase();
    const userAnswer = response.trim().toLowerCase();
    setCorrect(correctAnswer === userAnswer);
  };

  const handleNext = () => {
    setResponse("");
    setSubmitted(false);
    setCorrect(null);
    setCurrentIndex((prev) => (prev + 1) % qas.length);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>⏳ Loading prompts...</div>;
  }

  if (!qas.length) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>❗ No writing prompts available.</div>;
  }

  const currentQA = qas[currentIndex];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
      <h2 style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '20px' }}>
        {currentQA.question}
      </h2>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={6}
        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
        placeholder="Write your answer here..."
      />
      {!submitted ? (
        <div style={{ marginTop: '16px' }}>
          <button onClick={handleSubmit} style={buttonStyle}>📤 Submit</button>
        </div>
      ) : (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ color: correct ? '#28a745' : '#dc3545', fontSize: '18px', fontWeight: 'bold' }}>
            {correct ? '✅ Correct!' : `❌ Incorrect. Correct answer: ${currentQA.answer}`}
          </p>
          <button onClick={handleNext} style={{ ...buttonStyle, marginTop: '20px' }}>➡️ Next Prompt</button>
        </div>
      )}
    </div>
  );
};

export default WritingMode;
