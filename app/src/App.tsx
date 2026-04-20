import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import { Navigation } from './components/Navigation';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { EnvVarsPage } from './pages/EnvVarsPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { InvoiceDetailPage } from './pages/InvoiceDetailPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { createAppTheme, defaultTheme, darkTheme } from './theme';

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const theme = useMemo(() => createAppTheme(isDark ? darkTheme : defaultTheme), [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Navigation isDark={isDark} onToggleTheme={toggleTheme} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - 240px)` },
            }}
          >
            <Container maxWidth="xl">
              <Routes>
                <Route path="/" element={<Navigate to="/artists" replace />} />
                <Route path="/artists" element={<ArtistsPage />} />
                <Route path="/artists/:id" element={<ArtistDetailPage />} />
                <Route path="/artists/:id/albums/:albumId" element={<AlbumDetailPage />} />
                <Route path="/envvars" element={<EnvVarsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customers/:id" element={<CustomerDetailPage />} />
                <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;


console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
