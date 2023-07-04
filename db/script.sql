CREATE DATABASE shopping;

\c shopping;

-- Drop tables
DROP TABLE IF EXISTS "shipped";
DROP TABLE IF EXISTS "shipped_status";
DROP TABLE IF EXISTS "address";
DROP TABLE IF EXISTS "shopping_cart_detail";
DROP TABLE IF EXISTS "shopping_cart";
DROP TABLE IF EXISTS "order_detail";
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS "product";
DROP TABLE IF EXISTS "category";
DROP TABLE IF EXISTS "customer";
DROP TABLE IF EXISTS "user_account";
DROP TABLE IF EXISTS "city";
DROP TABLE IF EXISTS "region";


-- Tables Creation
CREATE TABLE "region" (
  "id" serial PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "city" (
  "id" serial PRIMARY KEY,
  "region_id" int,
  "name" varchar
);

CREATE TABLE "user_account" (
  "id" serial PRIMARY KEY,
  "email" varchar(25),
  "password" varchar(14),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "customer" (
  "id" serial PRIMARY KEY,
  "user_account_id" int,
  "first_name" varchar(20),
  "last_name" varchar(20),
  "phone" varchar(14),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "category" (
  "id" serial PRIMARY KEY,
  "category_name" varchar
);

CREATE TABLE "product" (
  "id" serial PRIMARY KEY,
  "product_name" varchar,
  "stock" int,
  "price" int,
  "image_url" varchar(255),
  "category_id" int
);

CREATE TABLE "order" (
  "id" serial PRIMARY KEY,
  "user_account_id" int,
  "total_price" int,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "order_detail" (
  "id" serial PRIMARY KEY,
  "order_id" int,
  "product_id" int,
  "quantity" int,
  "total_price" int
);

CREATE TABLE "shopping_cart" (
  "id" serial PRIMARY KEY,
  "user_account_id" int,
  "total_price" int
);

CREATE TABLE "shopping_cart_detail" (
  "id" serial PRIMARY KEY,
  "shopping_cart_id" int,
  "product_id" int,
  "quantity" int,
  "total_price" int
);

CREATE TABLE "address" (
  "id" serial PRIMARY KEY,
  "user_account_id" int,
  "city_id" int,
  "address" varchar,
  "zip_code" int
);

CREATE TABLE "shipped_status" (
  "id" serial PRIMARY KEY,
  "description" varchar
);

CREATE TABLE "shipped" (
  "id" serial PRIMARY KEY,
  "address_id" int,
  "shipped_status_id" int
);

-- index
ALTER TABLE "city" ADD FOREIGN KEY ("region_id") REFERENCES "region" ("id");
ALTER TABLE "customer" ADD FOREIGN KEY ("user_account_id") REFERENCES "user_account" ("id");
ALTER TABLE "order" ADD FOREIGN KEY ("user_account_id") REFERENCES "user_account" ("id");
ALTER TABLE "order_detail" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");
ALTER TABLE "order_detail" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");
ALTER TABLE "shopping_cart" ADD FOREIGN KEY ("user_account_id") REFERENCES "user_account" ("id");
ALTER TABLE "shopping_cart_detail" ADD FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_cart" ("id");
ALTER TABLE "shopping_cart_detail" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");
ALTER TABLE "address" ADD FOREIGN KEY ("user_account_id") REFERENCES "user_account" ("id");
ALTER TABLE "address" ADD FOREIGN KEY ("city_id") REFERENCES "city" ("id");
ALTER TABLE "shipped" ADD FOREIGN KEY ("address_id") REFERENCES "address" ("id");
ALTER TABLE "shipped" ADD FOREIGN KEY ("shipped_status_id") REFERENCES "shipped_status" ("id");
ALTER TABLE "product" ADD FOREIGN KEY ("category_id") REFERENCES "category" ("id");

-- test data Region
INSERT INTO region (name) VALUES ('Metropolitana');

-- test data city
INSERT INTO city (region_id, name) VALUES (1, 'Santiago');
INSERT INTO city (region_id, name) VALUES (1, 'Colina');
INSERT INTO city (region_id, name) VALUES (1, 'San Miguel');

-- test data user_account
INSERT INTO user_account (email, password) values ('test@test.cl', '1234');

-- test data customer
INSERT INTO customer (user_account_id, first_name, last_name, phone) values (1, 'Victor', 'Zamorano', '56942384773');

-- test data category
INSERT INTO category (category_name) VALUES ('Zapatilla');
INSERT INTO category (category_name) VALUES ('Polera');
INSERT INTO category (category_name) VALUES ('Pantalon');

-- test data product
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Zapatilla test 1', 50, 35000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 1);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Zapatilla test 2', 50, 45000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 1);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Zapatilla test 3', 50, 55000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 1);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Polera test 1', 50, 35000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 2);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Polera test 2', 50, 45000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 2);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Polera test 3', 50, 55000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 2);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Pantalon test 1', 50, 35000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 3);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Pantalon test 2', 50, 45000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 3);
INSERT INTO product (product_name, stock, price, image_url, category_id) VALUES ('Pantalon test 3', 50, 55000, 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg', 3);

-- test data shopping_cart
INSERT INTO shopping_cart (user_account_id, total_price) VALUES (1, 105000);

-- test data shopping_cart_detail
INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES (1, 1, 1, 35000);
INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES (1, 4, 1, 35000);
INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES (1, 7, 1, 35000);
