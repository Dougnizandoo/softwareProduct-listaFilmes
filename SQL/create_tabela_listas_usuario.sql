create schema if not exists impacta;

create table if not exists impacta.listas_usuario(
	user_id	varchar(50),
	table_id	varchar(50),
	table_nome	varchar(50),
	constraint pk_listas_usuario primary key(table_id),
	constraint fk_listas_usuario foreign key (user_id)
		references impacta.usuarios(id),
	CONSTRAINT unique_user_table_nome UNIQUE (user_id, table_nome);
);
