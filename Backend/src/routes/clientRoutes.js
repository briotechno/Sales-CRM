const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect); // Protect all client routes

router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/:id/quotations', clientController.getClientQuotations);
router.get('/:id/files', clientController.getClientFiles);
router.post('/:id/files', upload.array('files'), clientController.addClientFile);
router.delete('/:id/files/:fileId', clientController.deleteClientFile);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
