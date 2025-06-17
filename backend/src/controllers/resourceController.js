// controllers/resourceController.js
const Resource = require('../models/Resource');
const asyncHandler = require('../utils/asyncHandler');

// Create a new resource
exports.createResource = asyncHandler(async (req, res) => {
  const { title, url, category, tags, notes, status } = req.body;
  const resource = new Resource({
    title,
    url,
    category,
    tags,
    notes,
    status,
    user: req.user._id,
  });
  await resource.save();
  res.status(201).json(resource);
});

// Get all resources for the authenticated user
exports.getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ user: req.user._id });
  res.json(resources);
});

// Get a single resource by ID
exports.getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource || !resource.user.equals(req.user._id)) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  res.json(resource);
});

// Update a resource
exports.updateResource = asyncHandler(async (req, res) => {
  const { title, url, category, tags, notes, status } = req.body;
  const resource = await Resource.findById(req.params.id);
  if (!resource || !resource.user.equals(req.user._id)) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  resource.title = title || resource.title;
  resource.url = url || resource.url;
  resource.category = category || resource.category;
  resource.tags = tags || resource.tags;
  resource.notes = notes || resource.notes;
  resource.status = status || resource.status;
  await resource.save();
  res.json(resource);
});

// Delete a resource
exports.deleteResource = asyncHandler(async (req, res) => {
const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource || !resource.user.equals(req.user._id)) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  res.json({ message: 'Resource removed' });
});
