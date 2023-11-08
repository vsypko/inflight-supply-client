create TABLE airports(
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
ident varchar(7),
type_ap varchar(15),
name varchar(255) NOT NULL,
latitude numeric(15,13),
longitude numeric(15,13),
elevation_ft integer,
continent varchar(2),
country_iso varchar(2) NOT NULL DEFAULT "ZZ",
country varchar,
iso_region varchar(7),
municipality varchar(124),
scheduled varchar(3),
icao varchar(4) UNIQUE NOT NULL,
iata varchar(3) UNIQUE NOT NULL,
home_link varchar,
keywords varchar,
ts_ap: tsvector,
);

create TABLE countries(
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
iso char(2) not null,
title varchar(80) not null,
title_case varchar(80) not null,
iso3 char(4),
numcode smallint DEFAULT 0,
phonecode integer NOT NULL,
currency char(4),
currency3 smallint DEFAULT 0,
flag text
);


create TABLE companies(
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
category varchar(12),
name varchar(255),
reg_number varchar(16),
icao varchar(4) UNIQUE,
iata varchar(3) UNIQUE,
country_iso varchar(2) REFERENCES country (cn_iso) NOT NULL DEFAULT 'ZZ',
city varchar(35),
address varchar(128),
link varchar(128),
);

create TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname varchar(50),
  lastname varchar(50),
  email varchar(62) UNIQUE NOT NULL,
  password varchar(62),
  img_url varchar(36),
  activated boolean DEFAULT false,
  activ_link varchar(36),
  role integer REFERENCES roles (role_id),
  created DATE NOT NULL DEFAULT CURRENT_DATE
  company_id integer REFERENCES company (co_id) DEFAULT 0,
  phone varchar(14),
  country_iso varchar(2) REFERENCES countries (iso) DEFAULT 'ZZ'
);

create TABLE roles(
role_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
role_name varchar (10),
role_level integer
);

CREATE TABLE ipv4(
  ip_from inet,
  ip_to inet,
  ip_cn varchar(2)
);

CREATE TABLE ipv6(
  ip_from inet,
  ip_to inet,
  ip_cn varchar(2)
);

CREATE TABLE flights(
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  flight integer,
  type varchar(3),
  reg varchar(6),
  from varchar(3),
  to varchar(3),
  std time,
  sta time,
  seats integer,
  co_id integer,
  co_iata varchar(2)
  CONSTRAINT unique_row UNIQUE (date,flight,"from")
);

CREATE TABLE aircraft_types(
  act_id SERIAL PRIMARY KEY,
  act_name varchar(70),
  act_iata varchar(3),
  act_icao varchar(4)
);

//The table should create programmatically

CREATE TABLE fleet(
  id SERIAL PRIMARY KEY,
  name varchar(70),
  type varchar(3),
  reg varchar(8) UNIQUE NOT NULL,
  seats integer,
  co_id integer
);

CREATE TABLE supplies(
  id SERIAL PRIMARY KEY,
  code integer UNIQUE NOT NULL,
  title varchar(255),
  price: numeric(9,2),
  category varchar(32),
  area varchar(128),
  description text, 
  img_url varchar(36),
  co_id integer
);

CREATE TABLE places(
  id SERIAL PRIMARY KEY,
  ap_id integer REFERENCES airports (id),
  co_id integer REFERENCES companies (id)
);