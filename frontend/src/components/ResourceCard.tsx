// components/ResourceCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@tanstack/react-query';
import { deleteResource } from '../services/api';

interface ResourceCardProps {
  resource: any;
  onDelete: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const { mutate } = useMutation({mutationFn:deleteResource, 
    onSuccess: onDelete,
  });

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {resource.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resource.url}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
          {resource.tags.map((tag: string) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {resource.status}
          </Typography>
          <IconButton color="error" size="small" onClick={() => mutate(resource._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
