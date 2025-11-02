-- Add form template support to approvals table
-- Run this in Supabase SQL Editor

ALTER TABLE approvals
ADD COLUMN template_id BIGINT,
ADD COLUMN form_data JSONB;

-- Add comment to describe columns
COMMENT ON COLUMN approvals.template_id IS 'Form template ID used for this approval';
COMMENT ON COLUMN approvals.form_data IS 'JSON data from dynamic form fields';

-- Add index for faster queries
CREATE INDEX idx_approvals_template_id ON approvals(template_id);
