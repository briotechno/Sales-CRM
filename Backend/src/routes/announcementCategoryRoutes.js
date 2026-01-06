const express = require('express');
const router = express.Router();
const announcementCategoryController = require('../controllers/announcementCategoryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', announcementCategoryController.createCategory);
router.get('/', announcementCategoryController.getCategories);
router.get('/:id', announcementCategoryController.getCategoryById);
router.put('/:id', announcementCategoryController.updateCategory);
router.delete('/:id', announcementCategoryController.deleteCategory);

module.exports = router;
