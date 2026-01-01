const { pool } = require('../config/db');

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        // 1. Summary Stats
        const [totalEmployeesRows] = await pool.query(
            'SELECT COUNT(*) as count FROM employees WHERE user_id = ?',
            [userId]
        );
        const totalEmployees = totalEmployeesRows[0]?.count || 0;

        const [onLeaveRows] = await pool.query(
            'SELECT COUNT(DISTINCT employee_id) as count FROM leave_requests WHERE user_id = ? AND status = "Approved" AND ? BETWEEN from_date AND to_date',
            [userId, today]
        );
        const onLeave = onLeaveRows[0]?.count || 0;

        const presentToday = totalEmployees - onLeave;

        // Mocking unreadLeads as applications count for now as it's an HRM dashboard
        const [unreadLeadsRows] = await pool.query(
            'SELECT COUNT(*) as count FROM jobs WHERE user_id = ? AND status = "Active"',
            [userId]
        );
        const unreadLeads = unreadLeadsRows[0]?.count || 0;

        // 2. Department Distribution
        const [deptDistRows] = await pool.query(
            `SELECT d.department_name as name, COUNT(e.id) as employees, d.icon as color 
             FROM departments d 
             LEFT JOIN employees e ON d.id = e.department_id AND e.user_id = d.user_id 
             WHERE d.user_id = ? 
             GROUP BY d.id`,
            [userId]
        );

        const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#ea580c"];
        const departmentDistribution = deptDistRows.map((dept, index) => ({
            ...dept,
            color: dept.color?.startsWith('#') ? dept.color : COLORS[index % COLORS.length]
        }));

        // 3. Recent Leave Requests
        const [leaveRequestsRows] = await pool.query(
            `SELECT e.employee_name as name, d.department_name as department, 
             lt.leave_type as type, lr.days, lr.status, 
             DATE_FORMAT(lr.from_date, '%b %d') as date
             FROM leave_requests lr
             JOIN employees e ON lr.employee_id = e.id
             LEFT JOIN departments d ON e.department_id = d.id
             JOIN leave_types lt ON lr.leave_type_id = lt.id
             WHERE lr.user_id = ?
             ORDER BY lr.id DESC LIMIT 5`,
            [userId]
        );

        // 4. Recent Joiners
        const [recentJoinersRows] = await pool.query(
            `SELECT e.employee_name as name, deg.designation_name as designation, 
             d.department_name as department, DATE_FORMAT(e.joining_date, '%b %d, %Y') as joinDate,
             COALESCE(s.net_salary, 'N/A') as salary
             FROM employees e
             LEFT JOIN designations deg ON e.designation_id = deg.id
             LEFT JOIN departments d ON e.department_id = d.id
             LEFT JOIN salaries s ON e.employee_id = s.employee_id AND s.user_id = e.user_id
             WHERE e.user_id = ?
             ORDER BY e.joining_date DESC LIMIT 3`,
            [userId]
        );

        const recentJoiners = recentJoinersRows.map(joiner => ({
            ...joiner,
            salary: joiner.salary !== 'N/A' ? `₹${(joiner.salary / 100000).toFixed(1)}L` : 'N/A'
        }));

        // 5. Upcoming Tasks (Mocked for now as no tasks table exists)
        const upcomingTasks = [
            { task: "Performance Reviews - Q4", priority: "High", dueDate: "Nov 30, 2024", assignedTo: "HR Team" },
            { task: "Salary Processing - November", priority: "High", dueDate: "Nov 28, 2024", assignedTo: "Finance" },
            { task: "Policy Update Training", priority: "Medium", dueDate: "Dec 5, 2024", assignedTo: "HR Team" }
        ];

        // 6. Department Overview
        const [deptOverviewRows] = await pool.query(
            `SELECT d.id, d.department_name as name, d.icon as color,
             COUNT(e.id) as totalEmployees
             FROM departments d
             LEFT JOIN employees e ON d.id = e.department_id AND e.user_id = d.user_id
             WHERE d.user_id = ?
             GROUP BY d.id`,
            [userId]
        );

        const departmentOverview = await Promise.all(deptOverviewRows.map(async (dept) => {
            const [onLeaveDeptRows] = await pool.query(
                `SELECT COUNT(DISTINCT lr.employee_id) as count 
                 FROM leave_requests lr
                 JOIN employees e ON lr.employee_id = e.id
                 WHERE e.department_id = ? AND lr.user_id = ? 
                 AND lr.status = "Approved" AND ? BETWEEN lr.from_date AND lr.to_date`,
                [dept.id, userId, today]
            );
            const deptOnLeave = onLeaveDeptRows[0]?.count || 0;
            const deptPresent = dept.totalEmployees - deptOnLeave;
            const avgAttendance = dept.totalEmployees > 0
                ? `${Math.round((deptPresent / dept.totalEmployees) * 100)}%`
                : "0%";

            return {
                name: dept.name,
                totalEmployees: dept.totalEmployees,
                presentToday: deptPresent,
                onLeave: deptOnLeave,
                avgAttendance,
                color: dept.color?.startsWith('#') ? dept.color : COLORS[0]
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalEmployees: { value: totalEmployees, trend: "+0%" },
                    presentToday: { value: presentToday, trend: "+0%" },
                    onLeave: { value: onLeave, trend: "+0%" },
                    unreadLeads: { value: unreadLeads, trend: "+0%" }
                },
                departmentDistribution,
                leaveRequests: leaveRequestsRows,
                recentJoiners,
                upcomingTasks,
                departmentOverview
            }
        });
    } catch (error) {
        console.error('HRM Dashboard Error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardData
};
