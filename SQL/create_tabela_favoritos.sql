create schema if not exists impacta;


create table if not exists impacta.favoritos(
	user_id varchar(50),
	tmdb_id	varchar(50),
	tipo_midia	int,
	constraint pk_favoritos primary key (user_id, tmdb_id)
);
