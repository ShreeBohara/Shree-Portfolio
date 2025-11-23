-- Make title and year optional
alter table archive_photos alter column title drop not null;
alter table archive_photos alter column year drop not null;
