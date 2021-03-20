DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS series;

CREATE TABLE genres (
  id serial primary key,
  title character varying(255) NOT NULL UNIQUE
);

CREATE TABLE tvShows (
  id serial primary key,
  name varchar(255) NOT NULL foreign key,
  airDate date,
  inProduction boolean,
  tagline varchar(255),
  image varchar(255) NOT NULL,
  description text,
  language varchar(2) NOT NULL,
  network varchar(255),
  webpage varchar(255)
);

CREATE TABLE seasons (
  id serial primary key,
  name varchar(255) NOT NULL,
  number int WHERE number > 0 NOT NULL foreign key,
  airDate date,
  description text,
  poster varchar(255) NOT NULL,
  tvShowName varchar(255) NOT NULL,
);

CREATE TABLE shows (
  id serial primary key,
  name varchar(255) NOT NULL,
  number int WHERE number > 0 NOT NULL,
  airDate date,
  description text,
  season varchar(255) NOT NULL,
);

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  admin boolean
);

-- Lykilorð: "123"
INSERT INTO users (username, password) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
INSERT INTO users (username, password) VALUES ('user', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', false);
