const Team = require('../models/teamModel');

const teamController = {
    createTeam: async (req, res) => {
        try {
            // Ensure user_id comes ONLY from JWT token
            const userId = req.user.id;
            const teamId = await Team.create(req.body, userId);
            res.status(201).json({ message: 'Team created successfully', teamId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllTeams: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            // userId from token
            const data = await Team.findAll(req.user.id, page, limit, search);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTeamById: async (req, res) => {
        try {
            const team = await Team.findById(req.params.id, req.user.id);
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }
            res.status(200).json(team);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTeam: async (req, res) => {
        try {
            await Team.update(req.params.id, req.body, req.user.id);
            res.status(200).json({ message: 'Team updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTeam: async (req, res) => {
        try {
            await Team.delete(req.params.id, req.user.id);
            res.status(200).json({ message: 'Team deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = teamController;
