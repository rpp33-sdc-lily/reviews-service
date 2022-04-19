-- DROP DATABASE IF EXISTS reviews_service;

CREATE DATABASE IF NOT EXISTS reviews_service;

USE reviews_service;

CREATE TABLE IF NOT EXISTS reviews (
  review_id int NOT NULL AUTO_INCREMENT,
  product_id int,
  rating int,
  date datetime,
  summary varchar(60),
  body varchar(1000),
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name varchar(60),
  email varchar(60),
  response text,
  helpfulness integer,
  PRIMARY KEY(review_id)
);

CREATE INDEX reviews ON reviews(product_id, review_id, reported);

CREATE TABLE IF NOT EXISTS photos (
  photo_id int NOT NULL AUTO_INCREMENT,
  review_id int,
  url text NOT NULL,
  PRIMARY KEY(photo_id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(review_id)
    ON DELETE CASCADE
);

CREATE INDEX photos ON photos(photo_id, review_id);

CREATE TABLE IF NOT EXISTS characteristics (
  characteristic_id int NOT NULL AUTO_INCREMENT,
  product_id int NOT NULL,
  name text,
  PRIMARY KEY(characteristic_id)
);

CREATE INDEX characteristics ON characteristics(product_id);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id int NOT NULL AUTO_INCREMENT,
  characteristic_id int NOT NULL,
  review_id int NOT NULL,
  value int,
  PRIMARY KEY(id),
  FOREIGN KEY(review_id)
    REFERENCES reviews(review_id)
    ON DELETE CASCADE,
  FOREIGN KEY(characteristic_id)
    REFERENCES characteristics(characteristic_id)
    ON DELETE CASCADE
);

CREATE INDEX characteristicVals ON characteristic_reviews(characteristic_id);

-- LOAD DATA LOCAL INFILE './data/reviews.csv'
-- INTO TABLE reviews
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS;
-- SET date =

-- DECLARE @DateValue AS BIGINT = 1525939481255;

-- SELECT CONVERT(VARCHAR(10), DATEADD(SECOND, @DateValue/1000 ,'1970/1/1'), 105) + ' ' + CONVERT(VARCHAR(15), CAST(DATEADD(SECOND, @DateValue/1000 ,'1970/1/1') AS TIME), 100);

-- SELECT FORMAT(DATEADD(SECOND, 1525939481255/1000 ,'1970/1/1'), 'dd-MM-yyyy HH:MM:ss');

-- DATEADD(SECOND, 1596080481467/1000 ,'1970/1/1')

-- select from_unixtime(1596080481467/1000,"%Y-%m-%d %h %i %s");


-- LOAD DATA LOCAL INFILE './data/reviews.csv'
-- INTO TABLE reviews
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS;


LOAD DATA LOCAL INFILE './data/reviews.csv'
INTO TABLE reviews
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(review_id, product_id, rating, @var1, summary, body, @var2, @var3, reviewer_name, email, response, helpfulness)
SET date = FROM_UNIXTIME(FLOOR(@var1/1000)), recommend = IF(@var2='true', 1, 0), reported = IF(@var3='true', 1, 0);


-- (review_id, product_id, rating, date, summary, body, @var1, reported, reviewer_name, email, response, helpfulness)



-- to load data to characteristics table
LOAD DATA LOCAL INFILE './data/characteristics.csv'
INTO TABLE characteristics
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;


-- to load data to reviews_photos table
LOAD DATA LOCAL INFILE './data/reviews_photos.csv'
INTO TABLE photos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- to load data to characteristic_reviews table
LOAD DATA LOCAL INFILE './data/characteristic_reviews.csv'
INTO TABLE characteristic_reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;











-- mysql --local-infile -u root;



-- CREATE TABLE IF NOT EXISTS reviews (
--   review_id int NOT NULL AUTO_INCREMENT,
--   product_id int NOT NULL,
--   rating int NOT NULL,
--   date timestamp,
--   summary varchar(60) NOT NULL,
--   body varchar(1000) NOT NULL,
--   recommend boolean NOT NULL,
--   reported boolean,
--   reviewer_name varchar(60) NOT NULL,
--   email varchar(60) NOT NULL,
--   response text,
--   helpfulness integer,
--   PRIMARY KEY(review_id)
-- );

-- CREATE TABLE IF NOT EXISTS photos (
--   photo_id int NOT NULL AUTO_INCREMENT,
--   review_id int NOT NULL,
--   url text NOT NULL,
--   PRIMARY KEY(photo_id),
--   FOREIGN KEY (review_id)
--     REFERENCES reviews(review_id)
--     ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS characteristics (
--   characteristic_id int NOT NULL AUTO_INCREMENT,
--   product_id int NOT NULL,
--   name text,
--   PRIMARY KEY(characteristic_id)
-- );

-- CREATE TABLE IF NOT EXISTS characteristic_reviews (
--   id int NOT NULL AUTO_INCREMENT,
--   characteristic_id int NOT NULL,
--   review_id int NOT NULL,
--   value text,
--   PRIMARY KEY(id),
--   FOREIGN KEY(review_id)
--     REFERENCES reviews(review_id)
--     ON DELETE CASCADE,
--   FOREIGN KEY(characteristic_id)
--     REFERENCES characteristics(characteristic_id)
--     ON DELETE CASCADE
-- );