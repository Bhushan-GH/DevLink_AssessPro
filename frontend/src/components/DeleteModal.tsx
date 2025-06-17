import  { useState } from 'react';
import { Modal, Box, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteModal = ({ resourceId, onDelete }: { resourceId: string, onDelete: (id: string) => void }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(resourceId);
    setOpen(false);
  };

  return (
    <>
      <IconButton color="error" onClick={() => setOpen(true)}>
        <DeleteIcon />
      </IconButton>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteModal;