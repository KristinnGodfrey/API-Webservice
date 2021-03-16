DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS series;

CREATE TABLE genres (
  id serial primary key,
  title character varying(255) NOT NULL UNIQUE
);

CREATE TABLE series (
  id serial primary key,
  name varchar(255) NOT NULL,
  airDate date,
  inProduction boolean,
  tagline varchar(255),
  image varchar(255) NOT NULL,
  description text,
  language varchar(2) NOT NULL,
  network varchar(255),
  webpage varchar(255)
);