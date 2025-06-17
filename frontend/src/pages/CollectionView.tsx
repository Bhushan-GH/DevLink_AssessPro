import React, { useState } from 'react';
import { Box, TextField,CircularProgress,Grid, Typography, ToggleButtonGroup, Button, ToggleButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getResources } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import { debounce } from 'lodash';
import ResourceTable from '../components/ResourceTable';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ResourceForm from '../components/ResourceForm';
import { useNavigate } from 'react-router-dom';
import {useUserStore} from '../store/userStore'; // or wherever you defined it  
interface Resource {
  _id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes: string;
  status: string;
  createdAt: string;
}

const CollectionView: React.FC = () => {
  const navigate = useNavigate();
const logout = useUserStore((state) => state.logout);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [search, setSearch] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);

  const { data, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: getResources,
  });
    const queryClient = useQueryClient();
  const handleSave = () => {
    setShowForm(false);
queryClient.invalidateQueries({ queryKey: ['resources'] });  };
  const handleSearch = debounce((value: string) => {
    setSearch(value);
    if (data) {
      setFilteredResources(
        data.filter((resource) =>
          resource.title.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  }, 500);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading resources</Typography>;

  const resourcesToDisplay = search ? filteredResources : data ?? [];
  const handleDelete = () => {
  queryClient.invalidateQueries({ queryKey: ['resources'] });
};

  return (
    <Box>
      <TextField
        label="Search Resources"
        variant="outlined"
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}  
        sx={{ marginBottom: 2 }}
      />
  {/* Header with Logout button */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography variant="h5">My Resources</Typography>
    <Button variant="outlined" color="error" onClick={() => {
      logout();
      navigate('/login', { replace: true }); // prevent back navigation
    }}>
      Logout
    </Button>
  </Box>

      <Button onClick={() => setShowForm(true)}>Add Resource</Button>
      {showForm && <ResourceForm isOpen={showForm} onClose={() => setShowForm(false)}  onSave={handleSave}/>}
        

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(_, val) => val && setViewMode(val)}
        sx={{ marginY: 2 }}
      >
        <ToggleButton value="table">Table View</ToggleButton>
        <ToggleButton value="card">Card View</ToggleButton>
      </ToggleButtonGroup>
{resourcesToDisplay.length === 0 ? (
  <Typography>No results found.</Typography>
) : viewMode === 'table' ? (
  <ResourceTable resources={resourcesToDisplay} onDelete={handleDelete} onSave={handleSave}/>
) : (
  <Grid container spacing={2}>
    {resourcesToDisplay.map((resource) => (
      <Box
        key={resource._id}
        sx={{
          width: { xs: '100%', sm: '50%', md: '33.33%' },
          padding: 1,
          boxSizing: 'border-box',
        }}
      >
        <ResourceCard resource={resource} onDelete={handleDelete} />
      </Box>
    ))}
  </Grid>
)}

      <AnalyticsDashboard resources={resourcesToDisplay} />
    </Box>
  );
};

export default CollectionView;

