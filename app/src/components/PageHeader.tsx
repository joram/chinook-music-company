import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Paper, Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, crumbs, actions }) => (
  <Box sx={{ mb: 4 }}>
    {crumbs && crumbs.length > 0 && (
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 1.5, fontSize: '0.875rem' }}
      >
        {crumbs.map((crumb) =>
          crumb.to ? (
            <Link
              key={crumb.label}
              component={RouterLink}
              to={crumb.to}
              underline="hover"
              color="text.secondary"
            >
              {crumb.label}
            </Link>
          ) : (
            <Typography key={crumb.label} color="text.primary" fontSize="inherit">
              {crumb.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    )}
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
      <Box>
        <Typography variant="h3" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions}
    </Box>
  </Box>
);

interface DetailPanelProps {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ title, rows }) => (
  <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
    <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>
      {title}
    </Typography>
    <Box
      component="dl"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        columnGap: 3,
        rowGap: 1,
        m: 0,
      }}
    >
      {rows.map((row) => (
        <React.Fragment key={row.label}>
          <Typography component="dt" variant="body2" color="text.secondary">
            {row.label}
          </Typography>
          <Typography component="dd" variant="body2" sx={{ m: 0, wordBreak: 'break-word' }}>
            {row.value || '—'}
          </Typography>
        </React.Fragment>
      ))}
    </Box>
  </Paper>
);

interface StatProps {
  label: string;
  value: React.ReactNode;
}

export const StatStrip: React.FC<{ stats: StatProps[] }> = ({ stats }) => (
  <Box sx={{ display: 'flex', gap: { xs: 3, sm: 5 }, flexWrap: 'wrap' }}>
    {stats.map((stat) => (
      <Box key={stat.label}>
        <Typography variant="h5" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {stat.value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {stat.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

export const formatCurrency = (value: number | string) => `$${Number(value).toFixed(2)}`;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
};
