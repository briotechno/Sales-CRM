-- Migration to add call attempt and disqualification rules to lead_assignment_settings
-- Date: 2026-02-13

ALTER TABLE lead_assignment_settings
ADD COLUMN IF NOT EXISTS max_call_attempts INT DEFAULT 5,
ADD COLUMN IF NOT EXISTS call_time_gap_minutes INT DEFAULT 60,
ADD COLUMN IF NOT EXISTS auto_disqualification TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reassignment_on_disqualified TINYINT(1) DEFAULT 0;
