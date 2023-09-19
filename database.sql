create TABLE airports(
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
ident varchar(7),
type_ap varchar(15),
name varchar(255) NOT NULL,
latitude numeric(15,13),
longitude numeric(15,13),
elevation_ft integer,
continent varchar(2),
country varchar(2) NOT NULL DEFAULT "ZZ",
country_name varchar,
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
country varchar(2) REFERENCES country (cn_iso) NOT NULL DEFAULT 'ZZ',
city varchar(35),
address varchar(128),
link varchar(128),
table1 varchar(36),
table2 varchar(36)
);

create TABLE co_branch(
br_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
br_co_id integer REFERENCES company(co_id) NOT NULL,
br_iso_country varchar REFERENCES country (cn_iso) NOT NULL DEFAULT 'ZZ',
br_manager_name varchar,
br_manager_surname varchar
);

create TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usr_firstname varchar(50),
  usr_lastname varchar(50),
  usr_email varchar(62) UNIQUE NOT NULL,
  usr_password varchar(62),
  usr_url varchar(36),
  usr_activated boolean DEFAULT false,
  usr_activationlink varchar(36),
  usr_role integer REFERENCES roles (role_id),
  usr_created_time DATE NOT NULL DEFAULT CURRENT_DATE
  usr_co integer REFERENCES company (co_id) DEFAULT 0,
  usr_phone varchar(14),
  usr_cn varchar(2) REFERENCES countried (iso) DEFAULT 'ZZ'
);

create TABLE roles(
role_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
role_name varchar (10),
role_level integer
);

create TABLE tokens(
  tkn_id SERIAL PRIMARY KEY,
  tkn_refresh VARCHAR,
  tkn_usr INTEGER REFERENCES users (usr_id) UNIQUE NOT NULL
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

//The table should create programmatically

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
  CONSTRAINT unique_row UNIQUE (fl_date,fl_num,fl_from)
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
);

//The table should create programmatically
CREATE TABLE supply(
  id SERIAL PRIMARY KEY,
  code integer UNIQUE NOT NULL,
  title varchar(255),
  price: numeric(15,6),
  category varchar(32),
  area varchar(128),
  description text, 
  img_url uuid
);