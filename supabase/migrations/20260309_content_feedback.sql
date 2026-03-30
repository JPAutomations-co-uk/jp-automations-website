-- Content feedback table for self-annealing prompt system
create table content_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content_type text not null,          -- 'linkedin_post' | 'linkedin_plan'
  content_id text,                      -- optional identifier
  positive boolean not null,            -- true = thumbs up, false = thumbs down
  feedback_text text,                   -- only on thumbs down
  content_snapshot jsonb,               -- the generated content that was rated
  created_at timestamptz default now()
);

alter table content_feedback enable row level security;

create policy "Users manage own feedback" on content_feedback
  for all using (auth.uid() = user_id);

create index idx_feedback_user on content_feedback(user_id, content_type, created_at desc);
