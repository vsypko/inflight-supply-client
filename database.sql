create TABLE airports(
ap_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
ap_ident varchar(7),
ap_type varchar(15),
ap_name varchar(255) NOT NULL,
ap_latitude numeric(15,13),
ap_longitude numeric(15,13),
ap_elevation_ft integer,
ap_continent varchar(2),
ap_iso_country varchar(2) NOT NULL DEFAULT "ZZ",
ap_iso_region varchar(7),
ap_municipality varchar(124),
ap_scheduled varchar(3),
ap_icao_code varchar(4) UNIQUE NOT NULL,
ap_iata_code varchar(3) UNIQUE NOT NULL,
ap_home_link varchar,
ap_keywords varchar
);

create TABLE country(
cn_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
cn_iso char(2) not null,
cn_name varchar(80) not null,
cn_case_name varchar(80) not null,
cn_iso3 char(4),
cn_numcode smallint DEFAULT 0,
cn_phonecode integer NOT NULL,
cn_flag text
);


create TABLE company(
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
co_category varchar(12),
co_name varchar(255),
co_register_num varchar(16),
co_icao_code varchar(4) UNIQUE,
co_iata_code varchar(3) UNIQUE,
co_cn varchar(2) REFERENCES country (cn_iso) NOT NULL DEFAULT 'ZZ',
co_addr_city varchar(35),
co_addr_line varchar(128),
co_home_link varchar(128),
co_tb varchar(36),
co_tb2 varchar(36)
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
  usr_cn varchar(2) REFERENCES country (cn_iso) DEFAULT 'ZZ'
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
  name varchar(255),
  category varchar(32),
  area varchar(128),
  description text, 
  img_url varchar(36)
);