up:
alter table users rename column is_staff to is_superuser;
alter table users add is_contest_author tinyint unsigned not null default 0;
alter table users add is_challenge_author tinyint unsigned not null default 0;
alter table users add key (is_contest_author);
alter table users add key (is_challenge_author);

down:
alter table users rename column is_superuser to is_staff;
alter table users drop column is_contest_author;
alter table users drop column is_challenge_author;
