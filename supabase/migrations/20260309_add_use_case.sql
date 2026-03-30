-- Add use_case column to profiles
alter table profiles add column if not exists use_case text default 'business';
