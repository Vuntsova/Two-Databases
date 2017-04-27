CREATE SCHEMA TopSongsDB;
USE TopSongsDB;

CREATE TABLE top5000(
  position INT NOT NULL,
  artist VARCHAR(100),
  song VARCHAR (100),
  year INT(4),
  raw_total DECIMAL(10,2),
  raw_usa DECIMAL(10,2),
  raw_uk DECIMAL(10,2),
  raw_eur DECIMAL(10,2),
  raw_raw DECIMAL(10,2),
  PRIMARY KEY (position)
);

CREATE TABLE TopAlbums(
  position INT NOT NULL,
  artist VARCHAR(100),
  song VARCHAR (100),
  year INT(4),
  raw_total DECIMAL(10,2),
  raw_usa DECIMAL(10,2),
  raw_uk DECIMAL(10,2),
  raw_eur DECIMAL(10,2),
  raw_raw DECIMAL(10,2),
  PRIMARY KEY (position)
);


SELECT * FROM TopSongsDB.top5000;
SELECT * FROM TopSongsDB.TopAlbums;
