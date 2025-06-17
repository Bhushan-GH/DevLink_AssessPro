import React,{useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceSchema } from '../schemas/resourceSchema';
import { createResource, updateResource } from '../services/api';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Chip,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface ResourceFormProps {
  isOpen: boolean;
  resource?: any;
  onSave: (resource: any) => void;
  onClose?: () => void;
}

const TAGS = ['JavaScript', 'React', 'Node', 'MongoDB', 'TypeScript', 'CSS'];

const ResourceForm: React.FC<ResourceFormProps> = ({
  isOpen,
  resource,
  onSave,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues: resource || {
      title: '',
      url: '',
      category: '',
      tags: [],
      notes: '',
      status: 'reading',
    },
  });
    console.log('Current form errors:', errors);
    useEffect(() => {
  if (resource) {
    reset(resource); // pre-fill with existing values
  } else {
    reset({         // empty values for new resource
      title: '',
      url: '',
      category: '',
      tags: [],
      notes: '',
      status: 'reading',
    });
  }
}, [resource, reset]);

  const onSubmit = async (data: any) => {
    try {
      const savedResource = resource
        ? await updateResource(resource._id, data)
        : await createResource(data);
      onSave(savedResource);     // Inform parent
      if (onClose) onClose();    // Close modal
    } catch (error) {
      console.error('Failed to save resource:', error);
    }
  };

  const getErrorMessage = (error: unknown) =>
    typeof error === 'string' ? error : '';

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{resource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                error={!!errors.title}
                helperText={getErrorMessage(errors.title?.message)}
                fullWidth
              />
            )}
          />

          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="URL"
                error={!!errors.url}
                helperText={getErrorMessage(errors.url?.message)}
                fullWidth
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category"
                error={!!errors.category}
                helperText={getErrorMessage(errors.category?.message)}
                fullWidth
              />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="tags-label">Tags</InputLabel>
                <Select
                  {...field}
                  labelId="tags-label"
                  multiple
                  input={<OutlinedInput label="Tags" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {TAGS.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes"
                multiline
                rows={4}
                error={!!errors.notes}
                helperText={getErrorMessage(errors.notes?.message)}
                fullWidth
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select {...field} labelId="status-label" label="Status">
                  <MenuItem value="watching">Watching</MenuItem>
                  <MenuItem value="reading">Reading</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose} color="secondary" type="button">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {resource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceForm;
