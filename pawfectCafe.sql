-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) UNIQUE NOT NULL
);

-- Auth table
CREATE TABLE auth (
    uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    hash TEXT NOT NULL,
    role_id INT REFERENCES roles(id) DEFAULT 2, -- default user
    joined_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game scores
CREATE TABLE game_scores (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth(uuid) ON DELETE CASCADE,
    heart_score INT DEFAULT 0,
    coin_score INT DEFAULT 0,
    total_hearts_earned INT DEFAULT 0,
    total_coins_earned INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items catalog
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    item_type VARCHAR(20) NOT NULL, -- "raw" or "combined"
    diet_type VARCHAR(20) NOT NULL  -- "vegetarian" or "with_meat"
);

-- Inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth(uuid) ON DELETE CASCADE,
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    quantity INT DEFAULT 0,
    CONSTRAINT unique_user_item UNIQUE (user_id, item_id)
);

-- Recipes
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    result_item_id INT REFERENCES items(id),
    required_items INT[] NOT NULL
);

-- User-created recipes
CREATE TABLE user_recipes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth(uuid) ON DELETE CASCADE,
    ing1 INT REFERENCES items(id),
    ing2 INT REFERENCES items(id),
    ing3 INT REFERENCES items(id),
    combined INT REFERENCES items(id),
    created_at TIMESTAMP DEFAULT now()
);

-------------------------------------------------
-- SEEDING
-------------------------------------------------

-- Roles
INSERT INTO roles (role) VALUES ('admin'), ('user');

-- Admin user (replace hash with real bcrypt hash)
-- INSERT INTO auth (username, hash, role_id)
-- VALUES ('admin', 'random_30string_password', 1);

UPDATE auth
SET role_id = 1
WHERE username = 'admin';

-- Raw items
INSERT INTO items (name, description, image_url, item_type, diet_type) VALUES
('Avocado', 'Fresh avocado slices', 'avocado.png', 'raw', 'vegetarian'),
('Broccoli', 'Fresh green broccoli', 'broccoli.png', 'raw', 'vegetarian'),
('Carob', 'Carob powder for dogs', 'carob.png', 'raw', 'vegetarian'),
('Carrots', 'Crunchy orange carrots', 'carrots.png', 'raw', 'vegetarian'),
('Chicken', 'Raw chicken meat', 'chicken.png', 'raw', 'with_meat'),
('Egg', 'Whole egg with shell', 'egg.png', 'raw', 'vegetarian'),
('Goat Milk', 'Fresh goat milk', 'goatMilk.png', 'raw', 'vegetarian'),
('Lettuce', 'Crisp romaine lettuce', 'lettuce.png', 'raw', 'vegetarian'),
('Oat Flour', 'Ground oat flour', 'oatFlour.png', 'raw', 'vegetarian'),
('Peas', 'Fresh green peas', 'peas.png', 'raw', 'vegetarian'),
('Salmon', 'Raw salmon fillet', 'salmon.png', 'raw', 'with_meat'),
('Steak', 'Raw beef steak', 'steak.png', 'raw', 'with_meat'),
('Tuna', 'Raw tuna fillet', 'tuna.png', 'raw', 'with_meat'),
('Strawberry', 'Fresh ripe strawberries', 'strawberry.png', 'raw', 'vegetarian'),
('Banana', 'Fresh banana fruit', 'banana.png', 'raw', 'vegetarian');

-- Combined items
INSERT INTO items (name, description, image_url, item_type, diet_type) VALUES
('Avocado Salad', 'A salad with fresh avocado', 'avocadoSalad.png', 'combined', 'vegetarian'),
('Banana Split', 'Banana split with fruit toppings', 'bananaSplit.png', 'combined', 'vegetarian'),
('Chicken Chop', 'Cooked chicken chop', 'chickenChop.png', 'combined', 'with_meat'),
('Chicken Thigh', 'Juicy cooked chicken thigh', 'chickenThigh.png', 'combined', 'with_meat'),
('Pupcake', 'Cute cupcake for pups', 'pupcake.png', 'combined', 'vegetarian'),
('Salmon Steak', 'Cooked salmon steak', 'salmonSteak.png', 'combined', 'with_meat'),
('Sandwich', 'Hearty pet-friendly sandwich', 'sandwich.png', 'combined', 'vegetarian'),
('Strawberry Cake', 'Sweet strawberry cake', 'strawberryCake.png', 'combined', 'vegetarian'),
('Tacos', 'Pet-friendly tacos', 'tacos.png', 'combined', 'with_meat'),
('Kibbles', 'Default fallback food', 'kibbles.png', 'combined', 'with_meat');

-------------------------------------------------
-- RECIPES
-------------------------------------------------

-- Avocado Salad
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Avocado Salad'), ARRAY[
  (SELECT id FROM items WHERE name='Avocado'),
  (SELECT id FROM items WHERE name='Broccoli'),
  (SELECT id FROM items WHERE name='Carrots')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Avocado Salad'), ARRAY[
  (SELECT id FROM items WHERE name='Avocado'),
  (SELECT id FROM items WHERE name='Broccoli'),
  (SELECT id FROM items WHERE name='Egg')
]);

-- Banana Split
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Banana Split'), ARRAY[
  (SELECT id FROM items WHERE name='Banana'),
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Goat Milk')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Banana Split'), ARRAY[
  (SELECT id FROM items WHERE name='Banana'),
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Egg')
]);

-- Chicken Chop
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Chicken Chop'), ARRAY[
  (SELECT id FROM items WHERE name='Chicken'),
  (SELECT id FROM items WHERE name='Peas'),
  (SELECT id FROM items WHERE name='Carrots')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Chicken Chop'), ARRAY[
  (SELECT id FROM items WHERE name='Chicken'),
  (SELECT id FROM items WHERE name='Lettuce'),
  (SELECT id FROM items WHERE name='Carrots')
]);

-- Chicken Thigh
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Chicken Thigh'), ARRAY[
  (SELECT id FROM items WHERE name='Chicken'),
  (SELECT id FROM items WHERE name='Lettuce')
]);

-- Pupcake
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Pupcake'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Egg'),
  (SELECT id FROM items WHERE name='Goat Milk')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Pupcake'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Goat Milk'),
  (SELECT id FROM items WHERE name='Avocado')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Pupcake'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Egg'),
  (SELECT id FROM items WHERE name='Avocado')
]);

-- Salmon Steak
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Salmon Steak'), ARRAY[
  (SELECT id FROM items WHERE name='Salmon'),
  (SELECT id FROM items WHERE name='Peas'),
  (SELECT id FROM items WHERE name='Carrots')
]);

-- Sandwich
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Sandwich'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Lettuce'),
  (SELECT id FROM items WHERE name='Chicken')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Sandwich'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Lettuce'),
  (SELECT id FROM items WHERE name='Tuna')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Sandwich'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Carrots'),
  (SELECT id FROM items WHERE name='Lettuce')
]);

-- Strawberry Cake
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Strawberry Cake'), ARRAY[
  (SELECT id FROM items WHERE name='Carob'),
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Strawberry')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Strawberry Cake'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Strawberry'),
  (SELECT id FROM items WHERE name='Egg')
]);

-- Tacos
INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Tacos'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Lettuce'),
  (SELECT id FROM items WHERE name='Steak')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Tacos'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Peas'),
  (SELECT id FROM items WHERE name='Steak')
]);

INSERT INTO recipes (result_item_id, required_items)
VALUES ((SELECT id FROM items WHERE name='Tacos'), ARRAY[
  (SELECT id FROM items WHERE name='Oat Flour'),
  (SELECT id FROM items WHERE name='Lettuce'),
  (SELECT id FROM items WHERE name='Chicken')
]);