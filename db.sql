CREATE DATABASE db_fastFuel;

USE db_fastFuel;

CREATE TABLE users (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `fullName` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NUll,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NUll,
    `type` ENUM('admin', 'normal')
);

INSERT INTO users (fullName, phone, email, password, type)
VALUES ('Jose S.', '(11) 9999-8888', 'jose@admim.com', '123456', 'normal' ),
('Jose M.', '(11) 4421-8888', 'jose@email.com', '123456', 'normal');

CREATE TABLE products (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(4, 2) NOT NULL,
    `category` ENUM('desserts', 'sides', 'sandwiches', 'beverages'),
    `image` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL
);

INSERT INTO products (name, price, category, image, description) VALUES
('Pit Stop Classic', 7.00, 'sandwiches', 'https://i.ibb.co/HpFzXNX0/hamburguer.jpg', 'Simple and fast—grilled beef patty, fresh lettuce, tomato, and cheese. Perfect for a quick fuel-up!'),
('Turbo Bacon', 9.00, 'sandwiches', 'https://i.ibb.co/VYGzxRYF/x-tudo.jpg', 'A juicy burger stacked with crispy bacon, melted cheese, lettuce, tomato, and our signature sauce. Full speed flavor'),
('Double Gear', 12.00, 'sandwiches', 'https://i.ibb.co/prZW744b/gallery-216da7fc-8884-434c-be8d-80ed24e5e26c.jpg', 'Two juicy beef patties, double cheese, lettuce, tomato, and extra layers for double the power. Built for big appetites'),
('Fuel Monster', 15.00, 'sandwiches', 'https://i.ibb.co/GfQb2RCQ/gallery-1f302ebc-146e-485e-8cf3-d301deda2fae.jpg', 'Four towering layers of beef, cheese, bacon, and more—this beast is for true fuel champions only! Conquer it if you can!'),

('Coke', 3.00, 'beverages', 'https://148575793.cdn6.editmysite.com/uploads/1/4/8/5/148575793/GCJPQD3JK75ZWUJUJJAYTBAL.jpeg', '12 fl oz'),
('Sprite', 3.00, 'beverages', 'https://media.istockphoto.com/id/458556265/photo/sprite-can-on-an-isolated-white-background.jpg?s=170667a&w=0&k=20&c=x0KJntljvTeAIEdubKpsYQnE2-I91k0cFljM2MUyaZk=', '12 fl oz'),
('Dr. Pepper', 3.00, 'beverages', 'https://souvlakigeorge.com/wp-content/uploads/2023/10/drink-drpepper.jpg', '12 fl oz'),
('Fanta Orange', 3.00, 'beverages', 'https://i5.walmartimages.com/seo/Fanta-Orange-Soda-7-5oz-Small-Mini-Cans-3-8-Packs-24-Cans_26c52f08-addf-4c9c-a697-e0616f70aa55.333b41038a44fe079e80978a46f78a7c.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', '12 fl oz'),
('Diet Coke', 3.00, 'beverages', 'https://boxncase.com/cdn/shop/files/bevcc18.gallery_4e2b9308-e410-48c7-bc13-913760bc1311.jpg?v=1691529304', '12 fl oz'),
('Lemonade', 3.00, 'beverages', 'https://m.media-amazon.com/images/I/61D7pQX3-mL.jpg', '12 fl oz'),

('French Fries', 4.00, 'sides', 'https://png.pngtree.com/png-clipart/20240901/original/pngtree-delicious-french-fries-fast-food-png-image_15902895.png', 'Golden, crispy, and perfectly salted. The ultimate sidekick for any sandwich or burger!'),
('Onion Rings', 4.00, 'sides', 'https://media.istockphoto.com/id/518802156/photo/onion-rings.jpg?s=612x612&w=0&k=20&c=SVVifA9O-1cjBgy9bI-YAhcAAI9ohTv34VmOxhFIMpU=', 'Thick-cut onions coated in crispy batter and fried to perfection. Crunchy and crave-worthy!'),
('Salad', 4.00, 'sides', 'https://media.istockphoto.com/id/1090421790/photo/healthy-salad-caesar-in-plastic-package-for-take-away-or-food-delivery-isolated-on-a-white.jpg?s=612x612&w=0&k=20&c=IpDYQJ8IJ1A58TLFCuS16bIXwOtu9VGxAtFNCruRh8E=', 'A light and fresh mix of lettuce, tomatoes, and veggies. Perfect for a lighter fuel option.'),
('Mozzarella Sticks', 4.00, 'sides', 'https://thumbs.dreamstime.com/b/yummy-delicious-mozzarella-sticks-isolated-white-background-yummy-delicious-mozzarella-sticks-isolated-white-363106962.jpg', 'Crispy on the outside, melty on the inside. Served hot with marinara dipping sauce for extra flavor punch!'),

('Chocolate Milkshake', 5.00, 'desserts', 'https://uproxx.com/wp-content/uploads/2022/08/menuproduct-Hot_Fudge_Classic_Shake.webp', 'Rich, creamy, and full of chocolatey goodness. Blended to perfection for the ultimate sweet refreshment.'),
('Strawberry Sundae', 3.00, 'desserts', 'https://pinoycupidgifts.com/wp-content/uploads/2024/05/strawberry-sundae.jpg', 'Cool vanilla ice cream topped with sweet strawberry syrup and chunks of real strawberries. A fruity finish for your meal!'),
('Chocolate Chip Cookies', 2.00, 'desserts', 'https://media.officedepot.com/images/f_auto,q_auto,e_sharpen,h_450/products/216390/216390_o02/216390', '2 Warm, soft, and loaded cookies with melty chocolate chips. Classic comfort in every bite!'),
('Carrot Cake', 5.00, 'desserts', 'https://static.vecteezy.com/system/resources/thumbnails/049/390/139/small_2x/delicious-carrot-cake-slice-with-cream-cheese-frosting-and-pecan-toppings-transparent-background-png.png', 'Moist and spiced with a hint of cinnamon, layered with smooth cream cheese frosting.');

 SELECT * FROM products where category = "sides";
