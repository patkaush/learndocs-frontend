
import React, {useEffect, useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useParams } from 'react-router-dom';
import StudyMode from './StudyMode';
import NavigationBar from './components/NavigationBar';
import ReactMarkdown from "react-markdown";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';

const drawerWidth = 240;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { chatId } = useParams();
  useEffect(() => {
    if (!chatId) return;

    const fetchChatData = async () => {
      try {
        const [messagesRes, documentsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/chat/${chatId}/messages/`),
          fetch(`http://127.0.0.1:8000/chat/${chatId}/documents/`)
        ]);

        const messagesData = await messagesRes.json();
        const documentsData = await documentsRes.json();

        // Convert messages for chat-ui-kit format
        const formattedMessages = messagesData.map(msg => ({
          message: msg.content,
          direction: msg.sender === 'user' ? 'outgoing' : 'incoming',
          sender: msg.sender
        }));

        setMessages(formattedMessages);
        setUploadedFiles(documentsData.map(doc => doc.file_name));
      } catch (error) {
        console.error('Error loading chat data:', error);
      }
    };

    fetchChatData();
  }, [chatId]);

  const handleFileUpload = async(e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    try {
      let response = await fetch(`http://127.0.0.1:8000/chat/${chatId}/document`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

      const documentData = await response.json();
      console.log(documentData)
      setUploadedFiles((prev) => [...prev, documentData.file_name]);
      
    }catch(error){
      alert("Upload failed:"+ err);
    }finally{
      setUploading(false);
    }
  };

  const handleSend = async (innerHtml) => {
    if (!innerHtml.trim()) return;

    const userMessage = {
      message: innerHtml,
      direction: 'outgoing',
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'user',
          content: innerHtml }),
      });

      const data = await response.json();
      await new Promise(res => setTimeout(res, 600));
      console.log(data)
      const botMessage = {
        message: data.content,
        direction: 'incoming',
        sender: 'bot',
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API error:', error);
    }

    setIsTyping(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavigationBar />


      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)` }}>
        <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', background: '#f0f2f5' }}>
          <Box sx={{  flex:3,padding: '10px' }}>
            <MainContainer>
              <ChatContainer>
                <MessageList typingIndicator={isTyping && <TypingIndicator content="Bot is typing" />}>
                  {messages.map((msg, idx) => (
                    <Message
                      key={idx}
                      model={{
                        message: msg.message,
                        sentTime: 'just now',
                        direction: msg.direction,
                        position: 'single',
                      }}
                    >
                      {/* Markdown support */}
                      <Message.CustomContent>
                        <ReactMarkdown>{msg.message}</ReactMarkdown>
                      </Message.CustomContent>

                      </Message>
                  ))}
                </MessageList>
                <MessageInput placeholder="Type your message..." onSend={handleSend} attachButton={false} />
              </ChatContainer>
            </MainContainer>
          </Box>

          <Box sx={{ flex: 1, padding: '20px', background: '#fff' }}>
            <h3>Upload File</h3>
            <input
              type="file"
              onChange={handleFileUpload}
              style={{
                marginBottom: '20px',
                padding: '6px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />

            {uploading ? (
                <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <CircularProgress size={20} sx={{ marginRight: '8px' }} />
                <Typography variant="body1">
                  Processing document...
                </Typography>
              </Box>

            ) : (
              <>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <InsertDriveFileIcon sx={{ mr: 1 }} />
                <Typography component="h3" variant="h6">
                  Uploaded Files
                </Typography>
              </Box>
                {uploadedFiles.length === 0 ? (
                  <p>No files uploaded yet.</p>
                ) : (
                  <ul style={{ paddingLeft: 20 }}>
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx}>{file}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
            <Box sx={{ mt: 4 }}>
              <StudyMode chatId={chatId}/>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;
