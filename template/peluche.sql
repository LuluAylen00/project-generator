DROP DATABASE IF EXISTS peluche_db;
CREATE DATABASE peluche_db;
USE peluche_db;

CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
INSERT INTO categories (name) VALUES ('Animales'),('Pokemon');

CREATE TABLE brands (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255)
);

CREATE TABLE sizes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
INSERT INTO sizes (name) VALUES ('Pequeño'),('Mediano'),("Grande");

CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT UNSIGNED,
    brand_id INT UNSIGNED,
    price INT UNSIGNED NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    -- CONSTRAINT
    -- RESERVADA (columna) REFERENCES tabla(clave_primaria)
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);
INSERT INTO products (name, category_id, price, description) VALUES ('Peluche 1', 1, 100, 'Descripción 1'),('Peluche 2', 1, 200, 'Descripción 2'),('Peluche 3', 1, 200, 'Descripción 3'),('Peluche 4', 1, 200, 'Descripción 4'),('Peluche 5', 2, 200, 'Descripción 5');

CREATE TABLE products_sizes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    size_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (size_id) REFERENCES sizes (id)
);
INSERT INTO products_sizes (product_id, size_id) VALUES (1, 1), (2, 1), (1, 2);