CREATE SEQUENCE unirideAccount_seq;

CREATE TABLE unirideAccount (
    ID BIGINT PRIMARY KEY DEFAULT nextval('unirideAccount_seq') NOT NULL,
    accountName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    gender TEXT NOT NULL,
    birthday TEXT NOT NULL,
    schoolName TEXT NOT NULL
);