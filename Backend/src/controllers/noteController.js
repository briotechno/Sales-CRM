const Note = require('../models/noteModel');

const noteController = {
    createNote: async (req, res) => {
        try {
            const noteId = await Note.create(req.body, req.user.id);
            const newNote = await Note.findById(noteId, req.user.id);
            res.status(201).json({ message: 'Note created successfully', data: newNote });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getNotes: async (req, res) => {
        try {
            const { page, limit, category, search } = req.query;
            const data = await Note.findAll(req.user.id, page, limit, category, search);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getNoteById: async (req, res) => {
        try {
            const note = await Note.findById(req.params.id, req.user.id);
            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }
            res.status(200).json(note);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateNote: async (req, res) => {
        try {
            const updated = await Note.update(req.params.id, req.body, req.user.id);
            if (!updated) {
                return res.status(404).json({ message: 'Note not found or not authorized' });
            }
            const updatedNote = await Note.findById(req.params.id, req.user.id);
            res.status(200).json({ message: 'Note updated successfully', data: updatedNote });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteNote: async (req, res) => {
        try {
            const deleted = await Note.delete(req.params.id, req.user.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Note not found or not authorized' });
            }
            res.status(200).json({ message: 'Note deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = noteController;
