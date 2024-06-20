create table ac_state
(
    code integer primary key,
    name char(50) not null unique,
    alpha_code char(2) not null
);

create table ac_trader
(
     code integer primary key,
     name char(150) not null unique,
     address varchar(500) not null,
     gst_num char(20) not null unique,
     account_holder_name varchar(20) not null,
     account_number int not null unique,
     branch_name varchar(30) not null,
     ifsc_code varchar(20) not null unique,
     reg_title_1 char(50),
     reg_value_1 char(50),
     reg_title_2 char(50),
     reg_value_2 char(50),
     reg_title_3 char(50),
     reg_value_3 char(50),
     contact_1 char(20),
     contact_2 char(20),
     contact_3 char(20),
     state_code int not null
);

alter table ac_trader
add CONSTRAINT ac_trader_state_code_fk FOREIGN KEY ( state_code ) 
REFERENCES ac_state( code );


