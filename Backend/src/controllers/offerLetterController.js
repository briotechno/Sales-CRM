const OfferLetter = require('../models/offerLetterModel');

const createOfferLetter = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = { ...req.body, user_id: userId };
        const id = await OfferLetter.create(data);
        res.status(201).json({ message: 'Offer letter created successfully', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOfferLetters = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page, limit, search, status } = req.query;
        const result = await OfferLetter.findAll(userId, { page, limit, search, status });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOfferLetterById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const offerLetter = await OfferLetter.findById(id, userId);
        if (!offerLetter) {
            return res.status(404).json({ message: 'Offer letter not found' });
        }
        res.status(200).json(offerLetter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOfferLetter = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const success = await OfferLetter.update(id, userId, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Offer letter not found or no changes made' });
        }
        res.status(200).json({ message: 'Offer letter updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOfferLetter = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const success = await OfferLetter.delete(id, userId);
        if (!success) {
            return res.status(404).json({ message: 'Offer letter not found' });
        }
        res.status(200).json({ message: 'Offer letter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOfferLetter,
    getOfferLetters,
    getOfferLetterById,
    updateOfferLetter,
    deleteOfferLetter
};
