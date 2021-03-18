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

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username character varying(255) NOT NULL UNIQUE,
  password character varying(255) CONSTRAINT length CHECK (char_length(password) > 10)  NOT NULL,
  email character varying(255) NOT NULL UNIQUE,
  admin boolean NOT NULL DEFAULT FALSE,
  created date,
  updated date

);

-- Lykilorð: "123"
INSERT INTO users (username, password, email, admin, created) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', 'admin@admin.is', TRUE, '18/03/2021');
INSERT INTO users (username, password, email, admin, created) VALUES ('user', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', 'user@user.is', FALSE, '18/03/2021');
