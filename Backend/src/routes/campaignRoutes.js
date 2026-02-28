const express = require('express');
const router = express.Router();
const {
    createCampaign,
    getCampaigns,
    toggleStatus,
    deleteCampaign,
    updateCampaign
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createCampaign);
router.get('/', protect, getCampaigns);
router.patch('/:id/status', protect, toggleStatus);
router.delete('/:id', protect, deleteCampaign);
router.put('/:id', protect, updateCampaign);

module.exports = router;
