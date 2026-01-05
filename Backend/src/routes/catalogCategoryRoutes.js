const express = require('express');
const router = express.Router();
const catalogCategoryController = require('../controllers/catalogCategoryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', catalogCategoryController.createCategory);
router.get('/', catalogCategoryController.getCategories);
router.get('/:id', catalogCategoryController.getCategoryById);
router.put('/:id', catalogCategoryController.updateCategory);
router.delete('/:id', catalogCategoryController.deleteCategory);

module.exports = router;
