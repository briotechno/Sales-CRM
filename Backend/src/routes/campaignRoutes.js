const express = require('express');
const router = express.Router();
const {
    createCampaign,
    getCampaigns,
    toggleStatus,
    deleteCampaign,
    updateCampaign
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('campaign_create'), createCampaign);
router.get('/', protect, authorize('campaign_view'), getCampaigns);
router.patch('/:id/status', protect, authorize('campaign_edit'), toggleStatus);
router.delete('/:id', protect, authorize('campaign_delete'), deleteCampaign);
router.put('/:id', protect, authorize('campaign_edit'), updateCampaign);

module.exports = router;
