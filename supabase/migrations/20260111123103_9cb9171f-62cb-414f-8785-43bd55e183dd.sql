-- Add super_admin role to the enum (must be committed before use)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';