const Team = require('../models/teamModel');

const teamController = {
    createTeam: async (req, res) => {
        try {
            const teamId = await Team.create(req.body);
            res.status(201).json({ message: 'Team created successfully', teamId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllTeams: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const data = await Team.findAll(page, limit);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTeamById: async (req, res) => {
        try {
            const team = await Team.findById(req.params.id);
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
            await Team.update(req.params.id, req.body);
            res.status(200).json({ message: 'Team updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTeam: async (req, res) => {
        try {
            await Team.delete(req.params.id);
            res.status(200).json({ message: 'Team deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = teamController;
