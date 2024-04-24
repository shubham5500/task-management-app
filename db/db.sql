CREATE database task_management;

\c task_management;

create table users (
    id serial primary key, 
    name varchar(255), 
    username varchar(255) unique not null,
    email varchar(255) unique not null,
    password text not null,
    role varchar(255) default 'user'
);

create table boards (
    id serial primary key,
    title varchar(255) not null
)

create table lists (
    id serial primary key,
    title varchar(255) not null,
    board_id integer references boards(id) not null
);

create type TASK_STATUS as enum ('pending', 'completed', 'in_progess')
create type TASK_PRIORITY as enum ('low', 'medium', 'high')

create table tasks (
    id serial primary key,
    title varchar(255) not null,
    description text,
    status TASK_STATUS not null default 'pending',
    priority TASK_PRIORITY not null default 'low',
    due_date timestamp default current_timestamp,
    created_by integer references users(id) not null,
    assigned_to integer references users(id) not null,
    created_at timestamp default current_timestamp,
    list_id integer references lists(id) not null,
    position integer default 0
);

create task_file (
    id serial primary key,
    task_id references task(id),
    filename varchar(255),
    filepath text,
    uploaded_by references user(id),
    uploaded_at timestamp default current_timestamp
)