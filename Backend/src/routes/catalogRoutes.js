const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/public/:userId', catalogController.getPublicCatalogs);

router.use(protect);

router.post('/', upload.single('image'), catalogController.createCatalog);
router.get('/', catalogController.getCatalogs);
router.get('/:id', catalogController.getCatalogById);
router.put('/:id', upload.single('image'), catalogController.updateCatalog);
router.delete('/:id', catalogController.deleteCatalog);

module.exports = router;
