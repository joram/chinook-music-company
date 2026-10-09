import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { AppBar, Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { Navigation, drawerWidth } from './components/Navigation';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { EnvVarsPage } from './pages/EnvVarsPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { InvoiceDetailPage } from './pages/InvoiceDetailPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { createAppTheme, defaultTheme } from './theme';

// Create theme from configuration
// In the future, this could be selected dynamically (e.g., from user preferences, URL param, etc.)
const theme = createAppTheme(defaultTheme);

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{ display: { md: 'none' }, bgcolor: 'sidebar' }}
          >
            <Toolbar>
              <IconButton color="inherit" edge="start" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
                <Menu />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                Chinook
              </Typography>
            </Toolbar>
          </AppBar>
          <Navigation mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              px: { xs: 2, sm: 4 },
              pt: { xs: 10, md: 5 },
              pb: 5,
              width: { md: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Container maxWidth="xl" disableGutters>
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