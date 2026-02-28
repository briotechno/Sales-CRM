const Campaign = require('../models/campaignModel');
const CampaignAudience = require('../models/campaignAudienceModel');

const campaignController = {
    createCampaign: async (req, res) => {
        try {
            const userId = req.user.id;
            const {
                campaignName, source, startDate, startTime,
                endDate, endTime, timingType, leadLimitType,
                leadsPerDay, audienceType, selectedAudiences,
                hierarchySettings
            } = req.body;

            // 1. Create campaign basic info
            const campaignId = await Campaign.create({
                user_id: userId,
                name: campaignName,
                source,
                start_date: startDate,
                start_time: startTime,
                end_date: endDate,
                end_time: endTime,
                timing_type: timingType,
                lead_limit_type: leadLimitType,
                leads_per_day: leadsPerDay || 0,
                audience_type: audienceType
            });

            // 2. Prepare audience data with overrides
            let finalAudience = [];

            if (audienceType === "Individual") {
                finalAudience = selectedAudiences.map(empId => ({
                    employee_id: empId,
                    max_balance_override: null,
                    daily_limit_override: null,
                    is_unlimited: false,
                    is_investigation_officer: false
                }));
            } else {
                // For Team type, selection is teams, but we need settings per employee
                // selectedAudiences contains Team IDs
                // hierarchySettings[teamId][empId] contains overrides
                Object.keys(hierarchySettings).forEach(teamId => {
                    Object.keys(hierarchySettings[teamId]).forEach(empId => {
                        const settings = hierarchySettings[teamId][empId];
                        finalAudience.push({
                            employee_id: empId,
                            max_balance_override: settings.maxBalance || null,
                            daily_limit_override: settings.dailyLimit || null,
                            is_unlimited: settings.dailyLimitUnlimited || false,
                            is_investigation_officer: settings.isInvestigationOfficer || false
                        });
                    });
                });
            }

            // 3. Bulk create audience settings
            if (finalAudience.length > 0) {
                await CampaignAudience.bulkCreate(campaignId, finalAudience);
            }

            res.status(201).json({
                success: true,
                message: "Campaign created successfully",
                campaignId
            });
        } catch (error) {
            console.error('Error creating campaign:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getCampaigns: async (req, res) => {
        try {
            const userId = req.user.id;
            const campaigns = await Campaign.findAll(userId);
            res.status(200).json({ success: true, campaigns });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    toggleStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await Campaign.updateStatus(id, status);
            res.status(200).json({ success: true, message: `Campaign ${status} successfully` });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteCampaign: async (req, res) => {
        try {
            const { id } = req.params;
            await Campaign.delete(id);
            res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = campaignController;
