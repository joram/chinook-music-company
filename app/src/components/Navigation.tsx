import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  alpha,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { MusicNote, People, Business, Tune } from '@mui/icons-material';

export const drawerWidth = 248;

const menuItems = [
  { text: 'Artists', icon: <MusicNote />, path: '/artists' },
  { text: 'Customers', icon: <People />, path: '/customers' },
  { text: 'Employees', icon: <Business />, path: '/employees' },
];

const footerItems = [{ text: 'Environment', icon: <Tune />, path: '/envvars' }];

const Record: React.FC<{ size: number }> = ({ size }) => {
  const theme = useTheme();
  const label = theme.palette.secondary.main;
  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        transition: 'transform 1.6s cubic-bezier(.2,.7,.2,1)',
        '.brand:hover &': { transform: 'rotate(200deg)' },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <circle cx="50" cy="50" r="48" fill="#0A0F1E" />
      {[42, 36, 30].map((r) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#FFFFFF" strokeOpacity="0.09" strokeWidth="1" />
      ))}
      <path d="M50 6 A44 44 0 0 1 88 28" fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="50" r="18" fill={label} />
      <circle cx="50" cy="50" r="2.5" fill="#0A0F1E" />
    </Box>
  );
};

interface NavigationProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const sidebar = theme.palette.sidebar;

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  const renderItems = (items: typeof menuItems) =>
    items.map((item) => {
      const selected = location.pathname.startsWith(item.path);
      return (
        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={selected}
            onClick={() => go(item.path)}
            sx={{
              borderRadius: 2,
              color: alpha('#FFFFFF', 0.72),
              '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 },
              '&:hover': { backgroundColor: alpha('#FFFFFF', 0.06), color: '#FFFFFF' },
              '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: alpha('#FFFFFF', 0.1),
                color: '#FFFFFF',
                boxShadow: `inset 3px 0 0 ${theme.palette.secondary.main}`,
              },
              '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.secondary.main}` },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      );
    });

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 1.5, py: 3 }}>
      <Box
        className="brand"
        onClick={() => go('/artists')}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, mb: 4, cursor: 'pointer' }}
      >
        <Record size={44} />
        <Box>
          <Typography
            sx={{ fontFamily: theme.typography.h3.fontFamily, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.1, color: '#FFFFFF' }}
          >
            Chinook
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.55) }}>
            Music Company
          </Typography>
        </Box>
      </Box>
      <List disablePadding>{renderItems(menuItems)}</List>
      <Box sx={{ flexGrow: 1 }} />
      <List disablePadding>{renderItems(footerItems)}</List>
    </Box>
  );

  const paperSx = {
    width: drawerWidth,
    boxSizing: 'border-box' as const,
    backgroundColor: sidebar,
    border: 0,
  };

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': paperSx }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': paperSx }}
      >
        {content}
      </Drawer>
    </Box>
  );
};
