import React, { useEffect, useState } from 'react';
import { Alert, Box, Chip, CircularProgress, Typography } from '@mui/material';
import { EntityList } from '../components/EntityList';
import { PageHeader } from '../components/PageHeader';
import { envvarsApi } from '../services/api';

export const EnvVarsPage: React.FC = () => {
  const [apiEnvVars, setApiEnvVars] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const data = await envvarsApi.getAll();
        setApiEnvVars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch environment variables');
      } finally {
        setLoading(false);
      }
    };
    fetchEnvVars();
  }, []);

  // Get frontend environment variables (build-time)
  const frontendEnvVars: Record<string, string> = {};
  // Vite env vars are available via import.meta.env, but only those prefixed with VITE_
  // We'll show what's actually available
  if (import.meta.env.VITE_API_URL) {
    frontendEnvVars['VITE_API_URL'] = import.meta.env.VITE_API_URL;
  } else {
    frontendEnvVars['VITE_API_URL'] = '(not set)';
  }
  
  // Note: In Vite, we can't easily iterate over import.meta.env at runtime
  // Environment variables are replaced at build time, so we manually list known ones

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    {
      id: 'key',
      label: 'Variable',
      minWidth: 200,
      format: (value: string) => (
        <>
          <code>{value}</code>
          {value === 'VITE_API_URL' && <Chip label="Important" color="primary" size="small" sx={{ ml: 1 }} />}
        </>
      ),
    },
    {
      id: 'value',
      label: 'Value',
      minWidth: 200,
      format: (value: string) => <code style={{ wordBreak: 'break-all' }}>{value}</code>,
    },
  ];

  const renderEnvVarTable = (envVars: Record<string, string>, title: string) => (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <EntityList
        columns={columns}
        data={Object.entries(envVars).map(([key, value]) => ({ id: key, key, value }))}
        defaultSort={{ column: 'key', direction: 'asc' }}
        searchPlaceholder="Search variables"
        emptyMessage="No environment variables found."
      />
    </Box>
  );

  return (
    <Box>
      <PageHeader
        title="Environment"
        subtitle="Variables from the frontend build and the running API. Frontend values are baked in at build time."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Couldn't load API environment variables: {error}
        </Alert>
      )}

      {renderEnvVarTable(frontendEnvVars, 'Frontend (build time)')}

      {apiEnvVars && renderEnvVarTable(apiEnvVars, 'API (runtime)')}
    </Box>
  );
};
