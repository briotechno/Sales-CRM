const Stage = require('../models/stageModel');

const createStage = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Stage Name is required' });

        const id = await Stage.create(req.body, req.user.id);
        res.status(201).json({ status: true, message: 'Stage created successfully', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStages = async (req, res) => {
    try {
        const stages = await Stage.findAll(req.user.id);
        res.status(200).json(stages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStageById = async (req, res) => {
    try {
        const stage = await Stage.findById(req.params.id, req.user.id);
        if (!stage) return res.status(404).json({ message: 'Stage not found' });
        res.status(200).json(stage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStage = async (req, res) => {
    try {
        const success = await Stage.update(req.params.id, req.body, req.user.id);
        if (!success) return res.status(404).json({ message: 'Stage not found or no changes made' });
        res.status(200).json({ status: true, message: 'Stage updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStage = async (req, res) => {
    try {
        const success = await Stage.delete(req.params.id, req.user.id);
        if (!success) return res.status(404).json({ message: 'Stage not found' });
        res.status(200).json({ status: true, message: 'Stage deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStage,
    getStages,
    getStageById,
    updateStage,
    deleteStage
};
