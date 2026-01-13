const express = require('express');
const router = express.Router();
const {
    getAllProductKeys,
    getProductKeyById,
    createProductKey,
    updateProductKey,
    deleteProductKey
} = require('../controllers/productKeyController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(superAdmin);

router.route('/')
    .get(getAllProductKeys)
    .post(createProductKey);

router.route('/:id')
    .get(getProductKeyById)
    .put(updateProductKey)
    .delete(deleteProductKey);

module.exports = router;
