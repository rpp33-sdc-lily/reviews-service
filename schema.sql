DROP DATABASE IF EXISTS reviews_service;

CREATE DATABASE reviews_service;

USE reviews_service;

CREATE TABLE reviews (
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
  reported boolean,
  PRIMARY KEY(review_id)
);

CREATE TABLE photos (
  photo_id int NOT NULL AUTO_INCREMENT,
  url text NOT NULL,
  review_id int NOT NULL,
  PRIMARY KEY(photo_id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(review_id)
    ON DELETE CASCADE
);

CREATE TABLE characteristics (
  characteristic_id int NOT NULL AUTO_INCREMENT,
  product_id int NOT NULL,
  name text,
  PRIMARY KEY(characteristic_id)
);

CREATE TABLE characteristic_reviews (
  id int NOT NULL AUTO_INCREMENT,
  characteristic_id int NOT NULL,
  review_id int NOT NULL,
  value text,
  PRIMARY KEY(id),
  FOREIGN KEY(review_id)
    REFERENCES reviews(review_id)
    ON DELETE CASCADE,
  FOREIGN KEY(characteristic_id)
    REFERENCES characteristics(characteristic_id)
    ON DELETE CASCADE
);



-- CREATE TABLE characteristic_reviews AS (
--   SELECT reviews.review_id,
--          characteristics.characteristic_id
--   FROM reviews
--        INNER JOIN characteristics
--                ON reviews.product_id = characteristics.product_id
-- );


  -- id int NOT NULL AUTO_INCREMENT,
  -- value text,