import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { albumsApi, tracksApi } from '../services/api';
import { Album, Track } from '../types';
import { PageHeader, formatCurrency, formatDuration } from '../components/PageHeader';
import { Box, CircularProgress, Typography } from '@mui/material';

export const AlbumDetailPage: React.FC = () => {
  const { id, albumId } = useParams<{ id: string; albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!albumId) return;
      try {
        const [albumData, tracksData] = await Promise.all([
          albumsApi.getById(Number(albumId)),
          tracksApi.getAll(0, 1000, Number(albumId)),
        ]);
        setAlbum(albumData);
        setTracks(tracksData);
      } catch (error) {
        console.error('Error fetching album data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [albumId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!album) {
    return (
      <Box p={4}>
        <Typography variant="h4">Album not found</Typography>
      </Box>
    );
  }

  const columns = [
    { id: 'name', label: 'Track', minWidth: 250 },
    { id: 'composer', label: 'Composer', minWidth: 160 },
    { id: 'genre_name', label: 'Genre', minWidth: 100 },
    {
      id: 'milliseconds',
      label: 'Duration',
      minWidth: 80,
      align: 'right' as const,
      format: (value: number) => formatDuration(value),
    },
    {
      id: 'unit_price',
      label: 'Price',
      minWidth: 80,
      align: 'right' as const,
      format: (value: number | string) => formatCurrency(value),
    },
  ];

  const artistName = album.artist?.name || 'Unknown artist';
  const totalMs = tracks.reduce((sum, t) => sum + t.milliseconds, 0);

  return (
    <Box>
      <PageHeader
        title={album.title}
        subtitle={`${artistName}, ${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'}, ${formatDuration(totalMs)}`}
        crumbs={[
          { label: 'Artists', to: '/artists' },
          { label: artistName, to: `/artists/${id}` },
          { label: album.title },
        ]}
      />
      <EntityList
        columns={columns}
        data={tracks.map(t => ({
          ...t,
          id: t.track_id,
          genre_name: t.genre?.name || null,
        }))}
        searchPlaceholder="Search tracks"
        emptyMessage="This album has no tracks."
      />
    </Box>
  );
};
