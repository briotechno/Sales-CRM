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

        const [totalDeptsRows] = await pool.query(
            'SELECT COUNT(*) as count FROM departments WHERE user_id = ?',
            [userId]
        );
        const totalDepartments = totalDeptsRows[0]?.count || 0;

        const [totalDesignationsRows] = await pool.query(
            'SELECT COUNT(*) as count FROM designations WHERE user_id = ?',
            [userId]
        );
        const totalDesignations = totalDesignationsRows[0]?.count || 0;

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
             DATE_FORMAT(lr.from_date, '%b %d') as date,
             e.profile_picture as avatar
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
             COALESCE(s.net_salary, 'N/A') as salary,
             e.profile_picture as avatar
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

        // 5. Announcements
        const [announcementsRows] = await pool.query(
            `SELECT id, title, DATE_FORMAT(created_at, '%b %d') as date, 
             COALESCE(category, 'General') as tag
             FROM announcements
             WHERE user_id = ?
             ORDER BY created_at DESC LIMIT 3`,
            [userId]
        );

        // 6. Upcoming Anniversaries/Birthdays
        const [anniversariesRows] = await pool.query(
            `SELECT employee_name as name, d.department_name as department, profile_picture as avatar,
             CASE 
                WHEN MONTH(date_of_birth) = MONTH(CURDATE()) AND DAY(date_of_birth) = DAY(CURDATE()) THEN 'Today'
                ELSE DATE_FORMAT(date_of_birth, '%d %b') 
             END as date,
             TIMESTAMPDIFF(YEAR, joining_date, CURDATE()) as years
             FROM employees e
             LEFT JOIN departments d ON e.department_id = d.id
             WHERE e.user_id = ? 
             AND (
                (MONTH(date_of_birth) = MONTH(CURDATE()) AND DAY(date_of_birth) >= DAY(CURDATE()))
                OR (MONTH(joining_date) = MONTH(CURDATE()) AND DAY(joining_date) >= DAY(CURDATE()))
             )
             ORDER BY MONTH(date_of_birth), DAY(date_of_birth) LIMIT 3`,
            [userId]
        );

        // 7. Hiring Pipeline
        const [pipelineRows] = await pool.query(
            `SELECT a.status as stage, COUNT(*) as count 
             FROM applicants a
             JOIN jobs j ON a.job_id = j.id
             WHERE j.user_id = ? 
             GROUP BY a.status`,
            [userId]
        );
        const hiringPipeline = pipelineRows.length > 0 ? pipelineRows.map(row => ({
            stage: row.stage,
            count: row.count,
            color: row.stage === 'Screening' ? 'bg-blue-500' : row.stage === 'Interview' ? 'bg-orange-500' : 'bg-green-500'
        })) : [
            { stage: "Screening", count: 0, color: "bg-blue-500" },
            { stage: "Interview", count: 0, color: "bg-orange-500" },
            { stage: "Technical", count: 0, color: "bg-purple-500" },
            { stage: "Offered", count: 0, color: "bg-green-500" },
        ];

        // 8. Weekly Attendance Trend
        const [attendanceTrendRows] = await pool.query(
            `SELECT DATE_FORMAT(date, '%a') as day, 
             SUM(CASE WHEN status IN ('present', 'late', 'half-day') THEN 1 ELSE 0 END) as present,
             SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent
             FROM attendance 
             WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 5 DAY)
             GROUP BY date ORDER BY date ASC`,
            [userId]
        );

        // 9. Growth Calculations (Comparing with last month)
        const [prevMonthStats] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM employees WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as empCount,
                (SELECT COUNT(*) FROM jobs WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH) AND status = "Active") as jobCount,
                (SELECT COUNT(*) FROM departments WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as deptCount
            FROM DUAL
        `, [userId, userId, userId]);

        const calculateGrowth = (current, previous) => {
            if (!previous || previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const empGrowth = calculateGrowth(totalEmployees, prevMonthStats[0].empCount);
        const jobGrowth = calculateGrowth(unreadLeads, prevMonthStats[0].jobCount);
        const deptGrowth = calculateGrowth(totalDepartments, prevMonthStats[0].deptCount);

        // 10. Department Overview
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
                    totalEmployees: { value: totalEmployees, trend: `${empGrowth >= 0 ? '+' : ''}${empGrowth}%` },
                    presentToday: { value: presentToday, trend: `${presentToday >= (totalEmployees * 0.9) ? 'Stable' : 'Low'}` },
                    onLeave: { value: onLeave, trend: `${onLeave > 0 ? 'Active' : 'Zero'}` },
                    unreadLeads: { value: unreadLeads, trend: `${jobGrowth >= 0 ? '+' : ''}${jobGrowth}%` },
                    totalDepartments: { value: totalDepartments, trend: `${deptGrowth >= 0 ? '+' : ''}${deptGrowth}%` },
                    totalDesignations: { value: totalDesignations, trend: "Dynamic" }
                },
                departmentDistribution,
                leaveRequests: leaveRequestsRows,
                recentJoiners: recentJoinersRows,
                anniversaries: anniversariesRows,
                announcements: announcementsRows,
                hiringPipeline,
                attendanceData: attendanceTrendRows.length > 0 ? attendanceTrendRows : [
                    { day: "Mon", present: 0, absent: 0 },
                    { day: "Tue", present: 0, absent: 0 },
                    { day: "Wed", present: 0, absent: 0 },
                    { day: "Thu", present: 0, absent: 0 },
                    { day: "Fri", present: 0, absent: 0 },
                ],
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
