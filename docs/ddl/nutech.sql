-- nutech.banners definition

CREATE TABLE "banners" (
  "id" int NOT NULL AUTO_INCREMENT,
  "name" varchar(255) NOT NULL,
  "image" varchar(500) NOT NULL,
  "description" text NOT NULL,
  "created_at" datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY ("id")
);


-- nutech.services definition

CREATE TABLE "services" (
  "id" int NOT NULL AUTO_INCREMENT,
  "code" varchar(100) NOT NULL,
  "name" varchar(100) NOT NULL,
  "icon" varchar(255) NOT NULL,
  "price" decimal(10,2) NOT NULL,
  "created_at" datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY ("id")
);


-- nutech.users definition

CREATE TABLE "users" (
  "id" int NOT NULL AUTO_INCREMENT,
  "first_name" varchar(100) DEFAULT NULL,
  "last_name" varchar(100) DEFAULT NULL,
  "email" varchar(200) NOT NULL,
  "created_at" datetime(3) NOT NULL,
  "password" varchar(200) DEFAULT NULL,
  "profile_image" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id")
);


-- nutech.transactions definition

CREATE TABLE "transactions" (
  "id" int NOT NULL AUTO_INCREMENT,
  "invoice_number" varchar(40) DEFAULT NULL,
  "user_id" int DEFAULT NULL,
  "transaction_type" varchar(50) DEFAULT NULL,
  "description" text,
  "total_amount" decimal(10,2) DEFAULT NULL,
  "created_on" datetime(3) DEFAULT NULL,
  PRIMARY KEY ("id"),
  KEY "user_id" ("user_id"),
  CONSTRAINT "transactions_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);


-- nutech.users_balance definition

CREATE TABLE "users_balance" (
  "id" int NOT NULL AUTO_INCREMENT,
  "user_id" int DEFAULT NULL,
  "balance" decimal(10,2) DEFAULT NULL,
  PRIMARY KEY ("id"),
  UNIQUE KEY "unique_user_id" ("user_id"),
  CONSTRAINT "users_balance_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);