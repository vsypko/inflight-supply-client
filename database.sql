create TABLE airports(
ap_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
ap_ident varchar(7),
ap_type varchar,
ap_name varchar NOT NULL,
ap_latitude numeric(15,13),
ap_longitude numeric(15,13),
ap_elevation_ft integer,
ap_continent varchar(2),
ap_country varchar,
ap_iso_country varchar(2) NOT NULL,
ap_iso_region varchar(7),
ap_municipality varchar,
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
co_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
co_category varchar(12),
co_name varchar,
co_register_num varchar,
co_icao_code varchar UNIQUE,
co_iata_code varchar UNIQUE,
co_iso_country varchar REFERENCES country (cn_iso) NOT NULL DEFAULT 'ZZ',
co_addr_city varchar,
co_addr_line varchar,
co_home_link varchar
);

create TABLE co_branch(
br_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
br_co_id integer REFERENCES company(co_id) NOT NULL,
br_iso_country varchar REFERENCES country (cn_iso) NOT NULL DEFAULT 'ZZ',
br_manager_name varchar,
br_manager_surname varchar
);

create TABLE users(
  usr_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usr_firstname varchar,
  usr_lastname varchar,
  usr_email varchar UNIQUE NOT NULL,
  usr_password varchar,
  usr_photourl varchar,
  usr_activated boolean DEFAULT false,
  usr_activationlink varchar,
  usr_role integer REFERENCES roles (role_id),
  usr_created_time DATE NOT NULL DEFAULT CURRENT_DATE
  usr_co integer REFERENCES company (co_id) DEFAULT 0,
  usr_phone varchar(15),
  usr_cn varchar(2)
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

CREATE DOMAIN phone AS text CHECK(
    octet_length(VALUE)
        BETWEEN 1/*+*/ + 8
            AND 1/*+*/ + 15
                       + 3
    AND VALUE ~ '^\+\d+$'
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