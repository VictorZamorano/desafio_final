-- CREATE DATABASE shopping;

-- \c shopping;

-- Drop tables
DROP TABLE IF EXISTS "shipped";
DROP TABLE IF EXISTS "shipped_status";
DROP TABLE IF EXISTS "address";
DROP TABLE IF EXISTS "shopping_cart_detail";
DROP TABLE IF EXISTS "shopping_cart";
DROP TABLE IF EXISTS "order_detail";
DROP TABLE IF EXISTS "user_order";
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
  "active" boolean NOT NULL DEFAULT true,
  "first_name" varchar(20),
  "last_name" varchar(20),
  "phone" varchar(14),
  "email" varchar(25) UNIQUE,
  "password" varchar(60),
  "role" varchar(10) DEFAULT 'user',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE "customer" (
--   "id" serial PRIMARY KEY,
--   "user_account_id" int,
--   "first_name" varchar(20),
--   "last_name" varchar(20),
--   "phone" varchar(14),
--   "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE "category" (
  "id" serial PRIMARY KEY,
  "category_name" varchar
);

CREATE TABLE "product" (
  "id" serial PRIMARY KEY,
  "product_name" varchar UNIQUE,
  "stock" int,
  "price" int,
  "image_url" varchar(255) UNIQUE,
  "category_id" int,
  "active" boolean default true
);

CREATE TABLE "user_order" (
  "id" serial PRIMARY KEY,
  "user_account_id" int,
  "total_price" int,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_account_id")
    REFERENCES "user_account" ("id")
    ON DELETE CASCADE
);

CREATE TABLE "order_detail" (
  "id" serial PRIMARY KEY,
  "user_order_id" int,
  "product_id" int,
  "quantity" int,
  "total_price" int,
  FOREIGN KEY ("user_order_id")
    REFERENCES "user_order" ("id")
    ON DELETE CASCADE
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
  "total_price" int,
  FOREIGN KEY ("shopping_cart_id")
    REFERENCES "shopping_cart" ("id")
    ON DELETE CASCADE

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
-- ALTER TABLE "customer" ADD FOREIGN KEY ("user_account_id") REFERENCES "user_account" ("id");
-- ALTER TABLE "order" ADD FOREIGN KEY ("user_account_id") REFERENCES "user_account" ("id");
-- ALTER TABLE "order_detail" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");
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
INSERT INTO region (name) VALUES ('Arica y Parinacota');
INSERT INTO region (name) VALUES ('Tarapacá');
INSERT INTO region (name) VALUES ('Antofagasta');
INSERT INTO region (name) VALUES ('Atacama');
INSERT INTO region (name) VALUES ('Coquimbo');
INSERT INTO region (name) VALUES ('Valparaíso');
INSERT INTO region (name) VALUES ('Metropolitana');
INSERT INTO region (name) VALUES ('O’Higgins');
INSERT INTO region (name) VALUES ('Maule');
INSERT INTO region (name) VALUES ('Ñuble');
INSERT INTO region (name) VALUES ('Biobío');
INSERT INTO region (name) VALUES ('La Araucanía');
INSERT INTO region (name) VALUES ('Los Ríos');
INSERT INTO region (name) VALUES ('Los Lagos');
INSERT INTO region (name) VALUES ('Aysén');
INSERT INTO region (name) VALUES ('Magallanes y la Antártica');

-- test data city
INSERT INTO city (region_id, name) VALUES (1, 'Santiago');
INSERT INTO city (region_id, name) VALUES (1, 'Colina');
INSERT INTO city (region_id, name) VALUES (1, 'San Miguel');

-- test data user_account
INSERT INTO user_account (email, password) 
VALUES ('usuario12@example.com', 'password1');
INSERT INTO user_account (email, password) 
VALUES ('usuario2@example.com', 'password2');
INSERT INTO user_account (email, password) 
VALUES ('usuario3@example.com', 'password3');
INSERT INTO user_account (email, password) 
VALUES ('usuario4@example.com', 'password4');
INSERT INTO user_account (email, password) 
VALUES ('usuario5@example.com', 'password5');
INSERT INTO user_account (email, password) 
VALUES ('usuario6@example.com', 'password6');
INSERT INTO user_account (email, password) 
VALUES ('usuario7@example.com', 'password7');
INSERT INTO user_account (email, password) 
VALUES ('usuario8@example.com', 'password8');
INSERT INTO user_account (email, password) 
VALUES ('usuario9@example.com', 'password9');
INSERT INTO user_account (email, password) 
VALUES ('usuario10@example.com', 'password10');
INSERT INTO user_account (email, password) 
VALUES ('admin1@example.com', 'admin1');
INSERT INTO user_account (email, password) 
VALUES ('test@test.com', '$2b$10$dB8lP2/OB5bHs5hXUmpBMepr6ELuTOdxNwAirEyvHGzteSHFf5G7q');

-- test data customer
-- INSERT INTO customer (user_account_id, first_name, last_name, phone) values (1, 'Victor', 'Zamorano', '56942384773');
-- INSERT INTO customer (user_account_id, first_name, last_name, phone) values (2, 'renato', 'Perez', '56942384773');

-- test data category
INSERT INTO category (category_name) VALUES ('placa madre');
INSERT INTO category (category_name) VALUES ('ram');
INSERT INTO category (category_name) VALUES ('ssd y hdd');
INSERT INTO category (category_name) VALUES ('gabinetes');
INSERT INTO category (category_name) VALUES ('fuentes de poder');
INSERT INTO category (category_name) VALUES ('tarjetas de video');
INSERT INTO category (category_name) VALUES ('procesadores');


-- DATA PRODUCTS:

-- PLACAS MADRE:
INSERT INTO product (product_name, stock, price, image_url, category_id)
VALUES
  ('ASUS ROG Strix Z390-E Gaming', 10, 299980, 'https://img.pccomponentes.com/articles/17/172090/5.jpg', 1),
  ('MSI MPG Z390 Gaming Pro Carbon AC', 15, 699990, 'https://images.anandtech.com/doci/13407/msi-mpg_z390_gaming_pro_carbon_ac-2d-led.jpg', 1),
  ('Gigabyte Z390 Aorus Pro', 20, 599990, 'https://account.pugetsystems.com/pic_disp.php?height=500&width=500&id=50692', 1),
  ('ASUS Prime Z390-A', 12, 409990, 'https://www.asus.com/media/global/gallery/0KeXEzUYNI5jdDFS_setting_xxx_0_90_end_2000.png', 1),
  ('MSI B450 Tomahawk', 8, 174990, 'https://www.ozeros.com/wp-content/uploads/2019/06/b450tomahawk.png', 1),
  ('Gigabyte X570 Aorus Master', 14, 592990, 'https://static.gigabyte.com/StaticFile/Image/Global/9db583b7d17ba44141481b427274e714/Product/22020', 1),
  ('ASUS ROG Maximus XI Hero (Wi-Fi)', 17, 589369, 'https://dlcdnwebimgs.asus.com/gain/528C5A7B-1BFD-48F1-A198-9B1F72114486/w717/h525', 1),
  ('ASRock B450M Steel Legend', 9, 257990, 'https://www.techpowerup.com/img/9ULunqr7wKWlQqvy.jpg', 1),
  ('Gigabyte Z390 Aorus Ultra', 11, 449990, 'https://static.gigabyte.com/StaticFile/Image/Global/55ca812008781acae549a3ebefc753a2/Product/20360', 1),
  ('MSI X570-A Pro', 13, 271990, 'https://c1.neweggimages.com/ProductImage/13-144-263-Z07.jpg', 1);

-- RAM
INSERT INTO product (product_name, stock, price, image_url, category_id)
VALUES
  ('Corsair Vengeance LPX', 20, 29990 , 'https://cdnx.jumpseller.com/centralgamer/image/32606968/resize/1200/1200?1677528276', 2),
  ('Kingston HyperX Fury', 30, 20900, 'https://centrale.cl/wp-content/uploads/Memoria-RAM-8GB-6000Mhz-DDR5-Kingston-FURY-Beast.jpeg', 2),
  ('G.Skill Ripjaws V Series', 25, 58952, 'https://www.tytchilespa.cl/Home/img/p/7/5/8/6/7586-large_default.jpg', 2),
  ('Crucial Ballistix Sport LT', 35, 20000, 'https://tienda.lancenter.cl/8839-large_default/crucial-ballistix-sport-lt-8gb-dimm-ddr4-2400.jpg', 2),
  ('Corsair Dominator Platinum', 15, 194300, 'https://n1g.cl/Home/8721-large_default/corsair-dominator-platinum-rgb-32gb-ddr5-6000-2x-16gb-pc5-48000-xmp-30-amd-expo-cmt32gx5m2d6000z36.jpg', 2),
  ('Kingston HyperX Predator', 22, 21800, 'https://cdn1.spider.cl/14620-large_default/kingston-hyperx-predator-rgb-ddr4-32-gb-dimm-de-288-espigas-3000-mhzpc4-24000-cl16-135-v.jpg', 2),
  ('Team T-Force Dark Pro', 18, 124990, 'https://www.teamgroupinc.com/es/upload/product_color_b/0c74fd75f5a78c2ccd9bdd6b9219395b.jpg', 2),
  ('Patriot Viper Steel', 28, 143900, 'https://media.solotodo.com/media/products/1114790_picture_1584898450.jpg', 2),
  ('ADATA XPG Spectrix D80', 24, 79900, 'https://infographicssolutions.cl/wp-content/uploads/2020/12/187.jpg', 2),
  ('Corsair Vengeance RGB Pro', 32, 75990, 'https://media.spdigital.cl/thumbnails/products/icn75_cq_c5c13d11_thumbnail_4096.jpg', 2);

-- SSD y HDD
INSERT INTO product (product_name, stock, price, image_url, category_id)
VALUES
  ('Samsung 860 EVO', 12, 199990, 'https://images.samsung.com/is/image/samsung/es-860-evo-sata-3-2-5-ssd-mz-76e250b-eu-frontblack-273732098?$650_519_PNG$', 3),
  ('Crucial MX500', 18, 44900, 'https://alca-1396c.kxcdn.com/media/2019/02/crucial-mx500-1tb-ssd-smababa.jpg', 3),
  ('Western Digital Blue', 15, 39990, 'https://www.techbox.cl/wp-content/uploads/2023/02/63ef0528dfb9b90d2fee267e.jpg', 3),
  ('Kingston A2000', 22, 57189, 'https://cdnx.jumpseller.com/tecnoboss_chile/image/12230505/ktc-product-ssd-sa2000-2-SSD_KINGSTON_M2_NVME_250GB_2500MBPS_FAST.jpg?1606600899', 3),
  ('Western Digital Green', 10, 16462, 'https://cdn.shopify.com/s/files/1/0427/1069/6104/products/sigr7j33_4423f849_1500x.jpg?v=1668870338', 3),
  ('Samsung 970 EVO Plus', 16, 93742, 'https://www.megabytes.cl/wp-content/uploads/2020/06/samsung-970-evo.png', 3),
  ('Kingston KC2000', 14, 108100, 'https://cdn3.spider.cl/10892-large_default/disco-duro-kingston-kc2000-unidad-en-estado-solido-cifrado-2-tb-interno-m2-2280-pci-express-30-x4-nvme.jpg', 3),
  ('Western Digital Black SN750', 20, 67990, 'https://cdn3.spider.cl/6865-large_default/disco-ssd-western-digital-black-500gb-m2.jpg', 3),
  ('ADATA XPG SX8200 Pro', 17, 46906, 'https://www.advantage.cl/pub/media/catalog/product/cache/7ab9ad37458e19f7230ea748c61bbd0a/a/s/asx8200pnp-1tt-c.jpg', 3),
  ('Seagate Barracuda', 24, 52190, 'https://megadrivestore.cl/171-large_default/disco-duro-seagate-barracuda-1-tb-st1000dm010.jpg', 3);

-- GABINETES
INSERT INTO product (product_name, stock, price, image_url, category_id)
VALUES
  ('NZXT H510', 12, 239990, 'https://i.ebayimg.com/images/g/z7EAAOSwpr9hui-Q/s-l500.jpg', 4),
  ('Corsair Crystal Series 570X RGB', 18, 680611, 'https://cdn2.spider.cl/16557-large_default/gabinete-corsair-crystal-series-570x-rgb-atx-vidrio-templado-x5-led-rgb-espejado.jpg', 4),
  ('Fractal Design Meshify C', 15, 309890, 'https://media.solotodo.com/media/products/806533_picture_1535235799.jpg', 4),
  ('Phanteks P400A', 22, 173991, 'https://files.pccasegear.com/images/1603068871-PH-EC400ATG_DBK01_SYS02-thb.jpg', 4),
  ('Cooler Master MasterCase H500', 10, 575506, 'https://dyriwns3mbs7y.cloudfront.net/catalog/product/cache/61beee6da86eedcb4df588958cfb1b03/h/5/h500_argb_gallery_03-zoom.png', 4),
  ('Lian Li PC-O11 Dynamic', 16, 379990, 'https://n1g.cl/Home/5831-large_default/-lian-li-o11-dynamic-xl-rog-certificado-white-color-temp.jpg', 4),
  ('be quiet! Dark Base Pro 900', 14, 586800, 'https://sistemax.cl/image/cache/catalog/GABINETES/BGW15-800x1000.jpg', 4),
  ('Thermaltake View 71 RGB', 20, 426743, 'https://media.solotodo.com/media/products/1285113_picture_1607722849.jpg', 4),
  ('Cooler Master Cosmos C700P', 17, 999383, 'https://cdn.coolermaster.com/media/assets/1022/cosmos-c700p-black-edition-1-zoom.png', 4),
  ('Phanteks Enthoo Evolv X', 24, 676999, 'https://www.phanteks.com/images/product/Enthoo-Evolv-X/Black/PH-ES518ETG-1z.jpg', 4);


-- FUENTES DE PODER
INSERT INTO product (product_name, stock, price, image_url, category_id)
VALUES
  ('EVGA SuperNOVA', 10, 284990, 'https://90a1c75758623581b3f8-5c119c3de181c9857fcb2784776b17ef.ssl.cf2.rackcdn.com/616820_435651_01_front_comping.jpg', 5),
  ('Corsair RMx Series', 15, 167990, 'https://bip.cl/assets/fotos/30956/1..webp', 5),
  ('Seasonic Focus Plus Gold', 13, 258068, 'https://i0.wp.com/nuevatec.cl/wp-content/uploads/2023/07/SSR-750FX-1.webp?fit=1000%2C1000&ssl=1', 5),
  ('Thermaltake Toughpower Grand RGB', 18, 205564, 'https://http2.mlstatic.com/D_NQ_NP_728260-MLC43473581178_092020-O.webp', 5),
  ('Cooler Master V Series', 8, 49990, 'https://media.solotodo.com/media/products/1068352_picture_1580779559.jpg', 5),
  ('be quiet! Dark Power Pro', 12, 291990, 'https://sistemax.cl/image/cache/catalog/FUENTES/BN646-800x1000.jpg', 5),
  ('Antec HCG', 11, 96900, 'https://www.antec.com/product/power/images/hcg-gold750_pdt01.png', 5),
  ('Bitfenix BPA', 16, 41785, 'https://media.solotodo.com/media/products/825424_picture_1539854976.png', 5),
  ('SilverStone Strider Platinum', 14, 466990, 'https://www.silverstonetek.com/upload/images/products/st1200-pts/st1200-pts-34right-top.jpg', 5),
  ('FSP Hydro G', 20, 484631, 'https://www.fsplifestyle.com/upload/product/PIC22700000000010453.jpg', 5);

-- TARJETAS DE VIDEO
INSERT INTO product (product_name, stock, price, image_url, category_id)
VALUES
  ('Nvidia GeForce GTX 1080 Ti', 8, 459990, 'https://live.mrf.io/statics/i/ps/www.muycomputer.com/wp-content/uploads/2017/03/GTX1080Ti.jpg?width=1200&enable=upscale', 6),
  ('Nvidia GeForce RTX 2080 Ti', 12, 600000, 'https://i0.wp.com/www.pcmrace.com/wp-content/uploads/2018/09/geforce-2080Ti-front-fullres_1534783068.jpg?fit=2856%2C1472&ssl=1', 6),
  ('AMD Radeon RX 5700 XT', 10, 188216, 'https://www.notebookcheck.org/fileadmin/_processed_/b/6/csm_RX_5700_XT_18_70c9c4983a.jpg', 6),
  ('Nvidia GeForce GTX 1660 Ti', 15, 281900, 'https://asset.msi.com/resize/image/global/product/product_4_20190222170857_5c6fbc29e0f2b.png62405b38c58fe0f07fcef2367d8a9ba1/600.png', 6),
  ('Nvidia GeForce RTX 2060 Super', 6, 360000, 'https://m.media-amazon.com/images/I/61Sc1YDgA0L.jpg', 6),
  ('AMD Radeon RX 580', 11, 115000, 'https://m.media-amazon.com/images/I/61d9UD6BxEL._AC_SL1500_.jpg', 6),
  ('Nvidia GeForce GTX 1060', 9, 189990, 'https://www.notebookcheck.org/fileadmin/Notebooks/Sonstiges/Geforce_1060_Test/gtx1060g.jpg', 6),
  ('NVIDIA GeForce RTX 3060 VERTO', 14, 313490, 'https://www.paris.cl/dw/image/v2/BCHW_PRD/on/demandware.static/-/Sites-paris-marketplace/default/dw7c85a401/images/imagenes-productos/800/MKK5/MKK5JPN17E-0001-001.jpg?sw=513&sh=654&sm=fit', 6),
  ('Nvidia GeForce RTX 2070 Super', 7, 649990, 'https://dlcdnwebimgs.asus.com/gain/83B0B368-4044-45BC-850C-51887ACB2679/w717/h525', 6),
  ('AMD Radeon RX 5600 XT', 13, 389000, 'https://asset.msi.com/resize/image/global/product/product_4_20200103141432_5e0edbc8b18d0.png62405b38c58fe0f07fcef2367d8a9ba1/600.png', 6);

-- PROCESADORES
INSERT INTO product (product_name, stock, price, image_url, category_id)
VALUES
  ('Intel Core i9-10900K', 5, 355965, 'https://cdn2.spider.cl/11885-large_default/procesador-intel-core-i9-10900k-10core-37ghz-20m-cache-up-to-530-ghz-lga1200-20m-125w.jpg', 7),
  ('Intel Core i7-9700K', 7, 645990, 'https://sistemax.cl/image/cache/catalog/CPU%20INTEL/i79700l-800x1000.jpg', 7),
  ('Intel Core i5-9600K', 6, 276235, 'https://media.solotodo.com/media/products/829937_picture_1540686756.jpg', 7),
  ('AMD Ryzen 9 5900X', 9, 414990, 'https://dust2.gg/wp-content/uploads/2021/07/1-c7278e52-40fd-422b-a0f4-a4d4e8023aa4.png', 7),
  ('AMD Ryzen 7 5800X', 4, 291992, 'https://www.amd.com/system/files/2020-09/616656-amd-ryzen-7-5000-series-PIB-1260x709_0.png', 7),
  ('AMD Ryzen 5 5600X', 8, 295791, 'https://pegasum.cl/wp-content/uploads/2023/05/1_1000-1.jpg', 7),
  ('Intel Core i9-9900K', 7, 648674, 'https://cdn3.spider.cl/14258-large_default/procesador-intel-core-i9-9900k-8-core-16-thread-36ghz-50ghz-turbo-lga1151-v2-95w-sin-fan.jpg', 7),
  ('Intel Core i7-8700K', 11, 497990, 'https://media.spdigital.cl/thumbnails/products/c86_wvwh_99565e3b_thumbnail_4096.jpg', 7),
  ('Intel Core i5-8600K', 6, 318330, 'https://media.solotodo.com/media/products/686800_picture_1508782272.jpeg', 7),
  ('AMD Ryzen 7 3700X', 10, 299250, 'https://infographicssolutions.cl/wp-content/uploads/2020/12/438.jpg', 7);

-- test data shopping_cart
INSERT INTO shopping_cart (user_account_id, total_price) VALUES (1, 105000);

-- test data shopping_cart_detail
INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES (1, 1, 1, 35000);
INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES (1, 4, 1, 35000);
INSERT INTO shopping_cart_detail (shopping_cart_id, product_id, quantity, total_price) VALUES (1, 7, 1, 35000);
