create database tareas;

use tareas;

create table tareas(
    id int primary key auto_increment,
    titulo varchar(50) not null,
    descripcion varchar(50) not null
);