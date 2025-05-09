
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import NavigationBar from './components/NavigationBar';

const App = () => {
  const navigate = useNavigate();


  const handleStartChat = async () => {
    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
      });
      const data = await response.json();
      const chatId = data.chat_id;
      navigate(`/chat/${chatId}`); // route to /chat/:chat_id
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <NavigationBar  />

      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="contained" onClick={handleStartChat}>
          Start Chat
        </Button>
      </Box>
    </Box>
  );
}

export default App;