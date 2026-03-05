# Dashboard APIs Report

This document outlines the backend API endpoints integrated for the CRM, HRM, and Main Business Dashboards. All endpoints require authentication via the `protect` middleware and return real-time data from the production database.

## 1. CRM Dashboard API
Provides comprehensive statistics for the sales pipeline, team performance, and lead analysis with intelligent status detection (Closed/Won).

- **Endpoint:** `GET /api/crm-dashboard/stats`
- **Controller:** `backend/src/controllers/crmDashboardController.js`
- **Dynamic Logic:** Calculates Month-over-Month (MoM) growth for Quotations and Conversions.
- **Data Provided:**
    - `summary`: Key KPIs with real-time trends (`totalQuotations`, `totalQuotationsTrend`, `conversions`, `conversionsTrend`, `revenue`, `champions`).
    - `revenueTrend`: Monthly revenue growth for the last 6 months (converted to Lacs).
    - `recentLeads`: The 5 most recently created leads with normalized avatars.
    - `upcomingTasks`: Priority follow-up tasks due today or in the future.
    - `champions`: Top performing employees (returns revenue as numeric for chart accuracy).
    - `funnelData`: Multi-stage conversion metrics (Total → Contacted → Qualified → Proposal → Won).
    - `agingStats`: Monitoring for stagnant leads (3+ or 7+ days) and overdue follow-ups.
    - `winLossData`: Comparative analysis of won vs. lost deals by month.
    - `regionSales`: Sales distribution by city (Top 4).
    - `dropAnalysis`: Breakdown of reasons for lost leads.
    - `workloadData`: Current lead assignment volume vs. capacity per consultant.
    - `teamPerformance`: Detailed leaderboard showing conversion rates and numeric counts for mapping.

## 2. HRM Dashboard API
Provides high-level human resources metrics, MoM headcount growth, and attendance trends.

- **Endpoint:** `GET /api/hrm-dashboard/`
- **Controller:** `backend/src/controllers/hrmDashboardController.js`
- **Dynamic Logic:** Automatically calculates growth indicators by comparing current state with snapshots from 30 days ago.
- **Data Provided:**
    - `summary`: Headcount, Today's Presence, On Leave, and Active Jobs—all including dynamic `trend` strings (e.g., `+12%`, `Stable`, `Low`).
    - `departmentDistribution`: Staffing levels across different departments with dynamic color assignment.
    - `leaveRequests`: Real-time list of approved or pending leave applications.
    - `recentJoiners`: Onboarding details for the newest staff members.
    - `announcements`: Current company-wide alerts tagged by category.
    - `anniversaries`: Combined view of upcoming birthdays and work anniversaries.
    - `hiringPipeline`: Talent acquisition funnel (Screening → Interview → Technical → Offered).
    - `attendanceData`: Weekly present/absent trends for charting.
    - `departmentOverview`: Enterprise-level table showing staff, specific presence, and calculated average attendance per department.

## 3. Main Business Dashboard API
Aggregates high-level executive metrics and calculates cross-functional growth percentages.

- **Endpoint:** `GET /api/main-dashboard/stats`
- **Controller:** `backend/src/controllers/mainDashboardController.js`
- **Dynamic Logic:** Includes a 6-month historical revenue query and real-time MoM growth comparison for foundational KPIs.
- **Data Provided:**
    - `stats`: Totals for Leads, Pipeline Value, Active Clients, and Employees, each with a calculated `growth` percentage.
    - `revenueTrend`: Historical revenue data for the last 6 months (numeric values).
    - `revenueGoal`: Progress tracking against active targets in the `goals` table vs. actual Paid Invoices.
    - `recentDocuments`: Consolidated feed of latest Invoices and Quotations.
    - `upcomingTasks`: Today's focus priority tasks.
    - `recentLeads`: The 5 latest entrants into the sales pipeline.
    - `pipelineStages`: Distribution of deal volume across current pipeline stages.
    - `topPerformers`: Sales performance leaderboard.
    - `channels`: Numeric source effectiveness (Meta Ads, JustDial, etc.).

---
*Updated on March 5, 2026*
