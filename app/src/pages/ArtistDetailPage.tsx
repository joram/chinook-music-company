import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { artistsApi, albumsApi } from '../services/api';
import { Artist, Album } from '../types';
import { PageHeader } from '../components/PageHeader';
import { Box, CircularProgress, Typography } from '@mui/material';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [artistData, albumsData] = await Promise.all([
          artistsApi.getById(Number(id)),
          albumsApi.getAll(0, 1000, Number(id)),
        ]);
        setArtist(artistData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!artist) {
    return (
      <Box p={4}>
        <Typography variant="h4">Artist not found</Typography>
      </Box>
    );
  }

  const columns = [
    { id: 'title', label: 'Album', minWidth: 250 },
    { id: 'album_id', label: 'ID', minWidth: 50, width: 80, align: 'right' as const },
  ];

  const name = artist.name || 'Unknown artist';

  return (
    <Box>
      <PageHeader
        title={name}
        subtitle={`${albums.length} ${albums.length === 1 ? 'album' : 'albums'}`}
        crumbs={[{ label: 'Artists', to: '/artists' }, { label: name }]}
      />
      <EntityList
        columns={columns}
        data={albums.map(a => ({ ...a, id: a.album_id }))}
        onRowClick={(albumId) => navigate(`/artists/${id}/albums/${albumId}`)}
        defaultSort={{ column: 'title', direction: 'asc' }}
        searchPlaceholder="Search albums"
        emptyMessage="This artist has no albums in the catalog."
      />
    </Box>
  );
};
