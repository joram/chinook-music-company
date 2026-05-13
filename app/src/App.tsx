import { useState, useMemo, useEffect } from 'react';
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
import { createAppTheme, defaultTheme, darkTheme, gaudiTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'gaudi';

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'gaudi';

function App() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme');
    return isThemeMode(stored) ? stored : 'light';
  });

  const theme = useMemo(() => {
    const config = mode === 'dark' ? darkTheme : mode === 'gaudi' ? gaudiTheme : defaultTheme;
    return createAppTheme(config);
  }, [mode]);

  useEffect(() => {
    document.body.classList.toggle('gaudi-mode', mode === 'gaudi');
  }, [mode]);

  const handleSetTheme = (next: ThemeMode) => {
    setMode(next);
    localStorage.setItem('theme', next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Navigation mode={mode} onSetTheme={handleSetTheme} />
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
