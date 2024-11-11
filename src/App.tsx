// App.tsx
import React, { useEffect, useState } from 'react';
import Chatbot from './Chatbot';
import { CssBaseline, Box, Typography, Toolbar, AppBar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './Navbar';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const initialMode = localStorage.getItem('mode') || 'light';
    if (initialMode == 'light' || initialMode === 'dark') {
      setMode(initialMode);
    }
    else {
      localStorage.setItem('mode', 'light');
      setMode('light');
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('mode', newMode);
    setMode(newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AMP Documentation Chat
          </Typography>
          <Navbar mode={mode} toggleMode={toggleMode} />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >

        </Box>
        <Chatbot mode={mode} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
