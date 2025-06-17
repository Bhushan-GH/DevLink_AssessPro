// routes/resourceRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');

const router = express.Router();

router.route('/')
  .get(protect, getResources)
  .post(protect, createResource);

router.route('/:id')
  .get(protect, getResourceById)
  .put(protect, updateResource)
  .delete(protect, deleteResource);

module.exports = router;
