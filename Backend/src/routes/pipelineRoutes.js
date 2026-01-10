const express = require('express');
const router = express.Router();
const {
    createPipeline,
    getPipelines,
    getPipelineById,
    updatePipeline,
    deletePipeline,
    addPipelineStage,
    updatePipelineStage,
    deletePipelineStage
} = require('../controllers/pipelineController');
const { protect } = require('../middleware/authMiddleware');

// Pipeline Routes
router.post('/pipelines', protect, createPipeline);
router.get('/pipelines', protect, getPipelines);
router.get('/pipelines/:id', protect, getPipelineById);
router.put('/pipelines/:id', protect, updatePipeline);
router.delete('/pipelines/:id', protect, deletePipeline);

// Stage Routes
router.post('/pipeline-stages', protect, addPipelineStage);
router.put('/pipeline-stages/:id', protect, updatePipelineStage);
router.delete('/pipeline-stages/:id', protect, deletePipelineStage);

module.exports = router;
