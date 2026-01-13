const ProductKey = require('../models/productKeyModel');
const crypto = require('crypto');

const generateKey = () => {
    return Array.from({ length: 4 }, () =>
        crypto.randomBytes(2).toString('hex').toUpperCase()
    ).join('-');
};

const getAllProductKeys = async (req, res) => {
    try {
        const { status, searchTerm, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const productKeys = await ProductKey.findAll({ status, searchTerm, limit, offset });
        const total = await ProductKey.countAll({ status, searchTerm });

        res.json({
            data: productKeys,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductKeyById = async (req, res) => {
    try {
        const productKey = await ProductKey.findById(req.params.id);
        if (!productKey) {
            return res.status(404).json({ message: 'Product Key not found' });
        }
        res.json(productKey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProductKey = async (req, res) => {
    try {
        const keyData = {
            ...req.body,
            product_key: req.body.product_key || generateKey(),
            generatedOn: new Date().toISOString().split('T')[0]
        };
        const id = await ProductKey.create(keyData);
        const newProductKey = await ProductKey.findById(id);
        res.status(201).json(newProductKey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProductKey = async (req, res) => {
    try {
        const success = await ProductKey.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Product Key not found or no changes made' });
        }
        const updatedProductKey = await ProductKey.findById(req.params.id);
        res.json(updatedProductKey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProductKey = async (req, res) => {
    try {
        const success = await ProductKey.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Product Key not found' });
        }
        res.json({ message: 'Product Key deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProductKeys,
    getProductKeyById,
    createProductKey,
    updateProductKey,
    deleteProductKey
};
