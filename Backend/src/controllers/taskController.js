const Task = require('../models/taskModel');

const taskController = {
    createTask: async (req, res) => {
        try {
            const taskId = await Task.create(req.body, req.user.id);
            const newTask = await Task.findById(taskId, req.user.id);
            res.status(201).json({ message: 'Task created successfully', task: newTask });
        } catch (error) {
            console.error('Error in createTask:', error);
            res.status(500).json({ message: 'Error creating task', error: error.message });
        }
    },

    getTasks: async (req, res) => {
        try {
            // Get paginated tasks
            const tasks = await Task.findAll(req.user.id, req.query);

            // Get global summary stats (for stats cards and total counts)
            const summary = await Task.getSummary(req.user.id, req.query);

            // Pagination metadata
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const totalPages = Math.ceil((summary?.total || 0) / limit);

            res.status(200).json({
                tasks,
                summary: {
                    total: summary?.total || 0,
                    highPriority: summary?.highPriority || 0,
                    active: summary?.active || 0,
                    completed: summary?.completed || 0
                },
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: summary?.total || 0,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.error('Error in getTasks:', error);
            res.status(500).json({ message: 'Error fetching tasks', error: error.message });
        }
    },

    updateTask: async (req, res) => {
        try {
            const success = await Task.update(req.params.id, req.body, req.user.id);
            if (!success) {
                return res.status(404).json({ message: 'Task not found or unauthorized' });
            }
            const updatedTask = await Task.findById(req.params.id, req.user.id);
            res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
        } catch (error) {
            console.error('Error in updateTask:', error);
            res.status(500).json({ message: 'Error updating task', error: error.message });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const success = await Task.delete(req.params.id, req.user.id);
            if (!success) {
                return res.status(404).json({ message: 'Task not found or unauthorized' });
            }
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error in deleteTask:', error);
            res.status(500).json({ message: 'Error deleting task', error: error.message });
        }
    },

    toggleTaskStatus: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id, req.user.id);
            if (!task) {
                return res.status(404).json({ message: 'Task not found or unauthorized' });
            }
            const newStatus = task.completed ? 0 : 1;
            const statusText = newStatus ? 'Completed' : 'Active';
            await Task.update(req.params.id, { completed: newStatus, status: statusText }, req.user.id);
            res.status(200).json({ message: `Task marked as ${newStatus ? 'completed' : 'active'}`, status: newStatus, statusText });
        } catch (error) {
            console.error('Error in toggleTaskStatus:', error);
            res.status(500).json({ message: 'Error toggling task status', error: error.message });
        }
    }
};

module.exports = taskController;
