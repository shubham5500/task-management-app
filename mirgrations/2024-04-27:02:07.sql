alter table tasks 
    add column file_id integer,
    add column file_url text;

alter table tasks 
add constraint file_constraint 
foreign key file_id references task_files(id);

alter table tasks
drop column file_url;


alter table task_files rename column filepath to file_url;
alter table tasks drop column file_id;