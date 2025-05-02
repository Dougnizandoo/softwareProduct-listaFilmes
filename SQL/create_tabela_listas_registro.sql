create schema if not exists impacta;


create table if not exists impacta.listas_registro(
	table_id	varchar(50),
	tmdb_id		varchar(50),
	tipo_midia	int,
	constraint pk_listas_registro primary key (table_id, tmdb_id),
	constraint fk_listas_registro foreign key (table_id)
		references impacta.listas_usuario (table_id)
);