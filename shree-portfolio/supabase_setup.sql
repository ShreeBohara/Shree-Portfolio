-- Create table for archive photos
create table if not exists archive_photos (
  id uuid default gen_random_uuid() primary key,
  src text not null,
  thumbnail text,
  title text not null,
  year integer not null,
  description text,
  width integer not null,
  height integer not null,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table archive_photos enable row level security;

-- Create policy to allow public read access
create policy "Public photos are viewable by everyone"
  on archive_photos for select
  using ( true );

-- Create policy to allow authenticated users (admin) to insert
create policy "Admins can insert photos"
  on archive_photos for insert
  with check ( auth.role() = 'authenticated' );

-- Create policy to allow authenticated users (admin) to delete
create policy "Admins can delete photos"
  on archive_photos for delete
  using ( auth.role() = 'authenticated' );

-- Create storage bucket if it doesn't exist
insert into storage.buckets (id, name, public) values ('archive-photos', 'archive-photos', true)
on conflict (id) do nothing;

-- Create storage policy for public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'archive-photos' );

-- Create storage policy for admin upload
create policy "Admin Upload"
  on storage.objects for insert
  with check ( bucket_id = 'archive-photos' and auth.role() = 'authenticated' );

-- Create storage policy for admin delete
create policy "Admin Delete"
  on storage.objects for delete
  using ( bucket_id = 'archive-photos' and auth.role() = 'authenticated' );
