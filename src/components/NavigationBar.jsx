import { useEffect, useState } from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar, Typography, Divider, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const drawerWidth = 300;

export default function NavigationBar() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  const fetchChats = () => {
    fetch("http://localhost:8000/chats/")
      .then(res => res.json())
      .then(data => setChats(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchChats();  
  }, []);

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();  
    try {
      await fetch(`http://127.0.0.1:8000/chat/${chatId}`, {
        method: 'DELETE',
      });
      fetchChats(); 
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  const goToChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', padding: 2 }}>
        <Typography variant="h6">Learn Docs</Typography>
        <Divider sx={{ my: 2 }} />
        <Button variant="contained" color="primary" onClick={goHome} fullWidth sx={{ mb: 2 }}>
          Home
        </Button>
        <List>
          {chats.length > 0 ? chats.map((chat, idx) => (
            <ListItemButton key={idx} onClick={() => goToChat(chat.chat_id)} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText
                primary={chat.title ? chat.title : `Chat ${idx + 1}`}
                secondary={chat.chat_id.slice(0, 8)}
              />
              <IconButton onClick={(e) => handleDeleteChat(e, chat.chat_id)} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemButton>
          )) : <ListItemButton><ListItemText primary="No chats yet" /></ListItemButton>}
        </List>
      </Box>
    </Drawer>
  );
}
