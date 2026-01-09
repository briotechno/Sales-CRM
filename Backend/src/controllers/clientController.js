const Client = require('../models/clientModel');

const clientController = {
    createClient: async (req, res) => {
        try {
            const clientId = await Client.create(req.body, req.user.id);
            res.status(201).json({ success: true, message: 'Client created successfully', id: clientId });
        } catch (error) {
            console.error('Error creating client:', error);
            res.status(500).json({ success: false, message: 'Error creating client' });
        }
    },

    getAllClients: async (req, res) => {
        try {
            const { status, search } = req.query;
            const clients = await Client.findAll(req.user.id, { status, search });
            res.json({ success: true, data: clients });
        } catch (error) {
            console.error('Error fetching clients:', error);
            res.status(500).json({ success: false, message: 'Error fetching clients' });
        }
    },

    getClientById: async (req, res) => {
        try {
            const client = await Client.findById(req.params.id, req.user.id);
            if (!client) {
                return res.status(404).json({ success: false, message: 'Client not found' });
            }
            res.json({ success: true, data: client });
        } catch (error) {
            console.error('Error fetching client:', error);
            res.status(500).json({ success: false, message: 'Error fetching client' });
        }
    },

    updateClient: async (req, res) => {
        try {
            const success = await Client.update(req.params.id, req.body, req.user.id);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Client not found or no changes made' });
            }
            res.json({ success: true, message: 'Client updated successfully' });
        } catch (error) {
            console.error('Error updating client:', error);
            res.status(500).json({ success: false, message: 'Error updating client' });
        }
    },

    deleteClient: async (req, res) => {
        try {
            const success = await Client.delete(req.params.id, req.user.id);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Client not found' });
            }
            res.json({ success: true, message: 'Client deleted successfully' });
        } catch (error) {
            console.error('Error deleting client:', error);
            res.status(500).json({ success: false, message: 'Error deleting client' });
        }
    },

    getClientQuotations: async (req, res) => {
        try {
            const quotations = await Client.getClientQuotations(req.params.id, req.user.id);
            res.json({ success: true, data: quotations });
        } catch (error) {
            console.error('Error fetching client quotations:', error);
            res.status(500).json({ success: false, message: 'Error fetching client quotations' });
        }
    }
};

module.exports = clientController;
