import React, { useState, useEffect } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';

const FlashcardGrid = ({ chatId, query }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [revealedCards, setRevealedCards] = useState({});

  useEffect(() => {
    if (!chatId || !query) return;

    fetch(`http://localhost:8000/chat/${chatId}/flashcards?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setFlashcards(data))
      .catch(err => console.error("Failed to fetch flashcards:", err));
  }, [chatId, query]);

  const toggleReveal = (idx) => {
    setRevealedCards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px',zIndex:"1" }}>
      {flashcards.map((card, idx) => (
        <Flipper key={idx} flipKey={revealedCards[idx]} spring="gentle">
          <Flipped flipId={`card-${idx}`}>
            <div
              onClick={() => toggleReveal(idx)}
              style={{
                width: '280px',
                padding: '20px',
                borderRadius: '12px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: '0.3s ease',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                {card.Q}
              </div>
              {revealedCards[idx] && (
                <div style={{ color: '#555', marginTop: '8px' }}>
                  {card.A}
                </div>
              )}
            </div>
          </Flipped>
        </Flipper>
      ))}
    </div>
  );
};

export default FlashcardGrid;
