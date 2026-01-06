const Expense = require('../models/expenseModel');
const path = require('path');
const fs = require('fs');

const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date, description } = req.body;
        const receipt_url = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const expenseId = await Expense.create({
            title,
            amount,
            category,
            date,
            description,
            receipt_url
        }, req.user.id);

        res.status(201).json({ message: 'Expense created successfully', id: expenseId });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getExpenses = async (req, res) => {
    try {
        const result = await Expense.findAll(req.user.id, req.query, req.query);
        res.json(result);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id, req.user.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateExpense = async (req, res) => {
    try {
        const { title, amount, category, date, description, status } = req.body;
        const updateData = {};

        if (title) updateData.title = title;
        if (amount) updateData.amount = amount;
        if (category) updateData.category = category;
        if (date) updateData.date = date;
        if (description !== undefined) updateData.description = description;
        if (status) updateData.status = status;

        if (req.file) {
            updateData.receipt_url = req.file.path.replace(/\\/g, '/');
            // Optimally delete old file here if exists
        }

        await Expense.update(req.params.id, updateData, req.user.id);
        res.json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        await Expense.delete(req.params.id, req.user.id);
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
};
