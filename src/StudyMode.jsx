import React, { useState } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import FlashcardGrid from './components/Flashcard';
import MultipleChoice from './components/MultipleChoice';
import WritingMode from './components/WritingMode';
import FillInTheBlank from './components/FillInTheBlank';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const StudyMode = ({ chatId }) => {
  const [activeMode, setActiveMode] = useState(null);
  const [query, setQuery] = useState('');
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const handleModeClick = (mode) => {
    setPendingMode(mode);
    setShowQueryDialog(true);
  };

  const handleDialogConfirm = () => {
    setActiveMode(pendingMode);
    setShowQueryDialog(false);
  };

  const handleDialogCancel = () => {
    setShowQueryDialog(false);
  };

  const renderContent = () => {
    switch (activeMode) {
      case 'flashcards':
        return <FlashcardGrid chatId={chatId} query={query} />;
      case 'multipleChoice':
        return <MultipleChoice chatId={chatId} query={query} />;
      case 'writing':
        return <WritingMode chatId={chatId} query={query}/>;
      case 'fillInTheBlank':
        return <FillInTheBlank chatId={chatId} query={query} />;
      default:
        return null;
    }
  };

  const StudyModeButton = ({ label, mode }) => (
    <button
      onClick={() => handleModeClick(mode)}
      style={{
        padding: '12px 16px',
        margin: '6px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <h3>Select Study Mode</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <StudyModeButton label="Flashcards" mode="flashcards" />
        <StudyModeButton label="Multiple Choice" mode="multipleChoice" />
        <StudyModeButton label="Writing" mode="writing" />
        <StudyModeButton label="Fill in the Blanks" mode="fillInTheBlank" />
      </div>

      {/* Query Dialog */}
      <Dialog open={showQueryDialog} onClose={handleDialogCancel}>
        <DialogTitle>Enter a topic or question</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Query"
            type="text"
            fullWidth
            variant="standard"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Cancel</Button>
          <Button onClick={handleDialogConfirm} disabled={!query.trim()}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Content */}
      {activeMode && (
        <Flipper flipKey={activeMode}>
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.4)', // ✅ dark translucent background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1300,
    }}
  >
    <Flipped flipId="mode-content">
      <div
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '12px',
          width: '80%',
          maxWidth: '800px', // ✅ limit max width
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>{activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Mode</h4>
          <button
            onClick={() => setActiveMode(null)}
            style={{
              fontSize: 20,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#888',
            }}
          >
            ✖️
          </button>
        </div>

        <div style={{ marginTop: '25px' }}>
          {renderContent()}
        </div>
      </div>
    </Flipped>
  </div>
</Flipper>

      )}
    </div>
  );
};

export default StudyMode;
