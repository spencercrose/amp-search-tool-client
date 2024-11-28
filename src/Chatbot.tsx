// Chatbot.tsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import Response from './Response';

interface ChatbotProps {
  mode: 'light' | 'dark';
}

// Type definitions for chatbot message
interface ChatMessage {
  sender: 'user' | 'bot';
  content: string | React.ReactElement;
}

  /**
   * A chatbot component for displaying a conversation with a bot.
   * @param {ChatbotProps} props The properties for the chatbot component.
   * @param {ChatbotProps.mode} mode The mode of the chatbot, either 'light' or 'dark'.
   * @returns {React.ReactElement} The React element for the chatbot component.
   */
const Chatbot: React.FC<ChatbotProps> = ({ mode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const messagesBoxRef = useRef<HTMLDivElement>(null);

  const theme = {
    light: {
      backgroundColor: '#fff',
      textColor: '#333',
    },
    dark: {
      backgroundColor: '#333',
      textColor: '#fff',
    },
  };

  /**
   * Updates the userInput state with the value of the input text field.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event object of the input field.
   */
  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTo({
        top: messagesBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleUserKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUserSubmit();
    }
  };

  const handleUserSubmit = async () => {
    setLoading(true);
    
    // Add the user's message to the chat
    const userMessage: ChatMessage = { sender: 'user', content: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send the message to an external API (replace the URL with your API endpoint)
      const response = await axios.post(`${import.meta.env.VITE_QUERY_API_URL}/retrieve`, {
        session_id: "",
        message: userInput
      });

      // Add the bot's response to the chat
      const botMessage: ChatMessage = {
        sender: 'bot',
        content: <Response value={response?.data?.response} />
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage: ChatMessage = {
        sender: 'bot',
        content: 'Error: Unable to reach the API.'
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setLoading(false);

    // Clear the user input field
    setUserInput('');
  };

  return (
    <Box
      sx={{
        backgroundColor: theme[mode].backgroundColor,
        width: '80%',
        maxWidth: '100%',
        margin: '0 auto',
        padding: 2,
        borderRadius: 2,
        border: '1px solid #ccc',
      }}
    >
      <Box
        ref={messagesBoxRef}
        sx={{
          height: 300,
          overflowY: 'scroll',
          marginBottom: 2,
          padding: 1,
          border: '1px solid #ddd',
          borderRadius: 2,
          backgroundColor: theme[mode].backgroundColor,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((message, index) => (
          <Paper
            key={index}
            sx={{
              padding: 1,
              margin: 1,
              borderRadius: 2,
              color: theme[mode].textColor,
              backgroundColor: message.sender === 'user' ? (mode === 'light' ? '#e0f7fa' : '#4f4f4f') : (mode === 'light' ? '#e8eaf6' : '#6c6c6c'),
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Typography>{message.content}</Typography>
          </Paper>
        ))}
        {loading && (
          <Paper
          sx={{
            padding: 1,
            margin: 1,
            borderRadius: 2,
            color: theme[mode].textColor,
            backgroundColor: mode === 'light' ? '#e8eaf6' : '#6c6c6c',
            alignSelf: 'flex-start',
          }}
        >
            <Typography><CircularProgress size="30px" /></Typography>
            </Paper>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          onKeyDown={handleUserKeyPress}
          fullWidth
          variant="outlined"
          value={userInput}
          onChange={handleUserInputChange}
          placeholder="Type your message..."
          sx={{ marginRight: 1, backgroundColor: theme[mode].backgroundColor, }}
        />
        <Button variant="contained" color="primary" onClick={handleUserSubmit}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;