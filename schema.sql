DROP DATABASE IF EXISTS reviews_service;

CREATE DATABASE reviews_service;

USE reviews_service;

CREATE TABLE review (
  review_id int NOT NULL AUTO_INCREMENT,
  product_id int NOT NULL,
  reviewer_name varchar(60) NOT NULL,
  recommend boolean NOT NULL,
  rating int NOT NULL,
  summary varchar(60) NOT NULL,
  body varchar(1000) NOT NULL,
  email varchar(60) NOT NULL,
  date timestamp,
  response text,
  helpfulness integer,
  recommend boolean NOT NULL,
  reported boolean,
  PRIMARY KEY (review_id)
);

CREATE TABLE photos (


);