const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createStage,
    getStages,
    getStageById,
    updateStage,
    deleteStage
} = require('../controllers/stageController');

router.route('/')
    .post(protect, createStage)
    .get(protect, getStages);

router.route('/:id')
    .get(protect, getStageById)
    .put(protect, updateStage)
    .delete(protect, deleteStage);

module.exports = router;
