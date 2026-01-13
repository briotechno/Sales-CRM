const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const designationRoutes = require('./routes/designationRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const businessInfoRoutes = require('./routes/businessInfoRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const termsRoutes = require('./routes/termsRoutes');
const companyPolicyRoutes = require('./routes/companyPolicyRoutes');
const hrPolicyRoutes = require('./routes/hrPolicyRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const jobRoutes = require('./routes/jobRoutes');
const hrmDashboardRoutes = require('./routes/hrmDashboardRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/business-info', businessInfoRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/company-policies', companyPolicyRoutes);
app.use('/api/hr-policies', hrPolicyRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/hrm-dashboard', hrmDashboardRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/catalogs', require('./routes/catalogRoutes'));
app.use('/api/catalog-categories', require('./routes/catalogCategoryRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/quotations', require('./routes/quotationRoutes'));
app.use('/api/expenses', expenseRoutes);
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/announcement-categories', require('./routes/announcementCategoryRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api', require('./routes/pipelineRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/stages', require('./routes/stageRoutes'));
app.use('/api/enterprises', require('./routes/enterpriseRoutes'));



app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
