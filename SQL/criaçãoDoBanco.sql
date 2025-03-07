create schema if not exists impacta;


create table if not exists impacta.usuarios(
	id	varchar(50),
	nome	varchar(100),
	dataNascimento	date,
	genero	INT,
	email	varchar(100) unique,
	senha	text	not null,
	
	constraint pk_usuarios_id primary key (id)
);
