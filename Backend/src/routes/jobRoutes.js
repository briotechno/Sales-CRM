const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobStats
} = require('../controllers/jobController');

router.use(protect); // Protect all routes

router.route('/')
    .post(createJob)
    .get(getJobs);

router.get('/stats', getJobStats);

router.route('/:id')
    .get(getJobById)
    .put(updateJob)
    .delete(deleteJob);

module.exports = router;
