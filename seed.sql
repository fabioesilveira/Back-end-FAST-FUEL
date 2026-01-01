USE db_fastFuel;

-- USERS 

INSERT INTO users (fullName, phone, email, password, type)
VALUES
('adm', '(11) 9999-8888', 'fast-fuel@admin.com', 'adminFF', 'admin'),
('Jose M.', '(11) 4421-8888', 'jose@email.com', '123456', 'normal');


-- PRODUCTS 

INSERT INTO products (name, price, category, image, description) VALUES
('Pit Stop Classic / 350kcal', 5.00, 'sandwiches', 'https://media.istockphoto.com/id/2158592905/photo/beef-patty-burger-with-vegetables-and-lettuce-on-white-background-file-contains-clipping-path.jpg?s=612x612&w=0&k=20&c=1mUN5sPZh5A2SRhAqs3tFrFW9cHhA4REkuUTp1h_9lI=', 'Simple and fast—grilled beef patty, fresh lettuce, tomato, and cheese. Perfect for a quick fuel-up'),
('Turbo Bacon / 450kcal', 7.00, 'sandwiches', 'https://i.ibb.co/VYGzxRYF/x-tudo.jpg', 'A juicy burger stacked with crispy bacon, melted cheese, lettuce, tomato, and our signature sauce.'),
('Double Gear / 510kcal', 9.00, 'sandwiches', 'https://www.shutterstock.com/image-photo/appetizing-hamburger-cheeseburger-two-patties-600nw-2571312207.jpg', 'Two juicy beef patties, double cheese, lettuce, tomato, and extra layers for double the power. Built for big appetites'),
('Fuel Monster / 600kcal', 11.00, 'sandwiches', 'https://png.pngtree.com/png-clipart/20250221/original/pngtree-bacon-burger-white-background-png-image_20491350.png', 'Layered with juicy beef, rich cheese, smoky bacon, and bold flavors, this monster is made for fuel champions.'),

('Coke / 150kcal', 2.50, 'beverages', 'https://148575793.cdn6.editmysite.com/uploads/1/4/8/5/148575793/GCJPQD3JK75ZWUJUJJAYTBAL.jpeg', '12 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'),
('Sprite / 140 kcal', 2.50, 'beverages', 'https://media.istockphoto.com/id/458556265/photo/sprite-can-on-an-isolated-white-background.jpg?s=170667a&w=0&k=20&c=x0KJntljvTeAIEdubKpsYQnE2-I91k0cFljM2MUyaZk=', '12 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'),
('Dr. Pepper / 150kcal', 2.50, 'beverages', 'https://souvlakigeorge.com/wp-content/uploads/2023/10/drink-drpepper.jpg', '12 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'),
('Fanta Orange / 160kcal', 2.50, 'beverages', 'https://i5.walmartimages.com/seo/Fanta-Orange-Soda-7-5oz-Small-Mini-Cans-3-8-Packs-24-Cans_26c52f08-addf-4c9c-a697-e0616f70aa55.333b41038a44fe079e80978a46f78a7c.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', '12 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'),
('Diet Coke / 2kcal', 2.50, 'beverages', 'https://boxncase.com/cdn/shop/files/bevcc18.gallery_4e2b9308-e410-48c7-bc13-913760bc1311.jpg?v=1691529304', '12 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'),
('Lemonade / 150kcal', 2.50, 'beverages', 'https://m.media-amazon.com/images/I/61D7pQX3-mL.jpg', '12 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'),

('French Fries / 300kcal', 3.00, 'sides', 'https://png.pngtree.com/png-clipart/20240901/original/pngtree-delicious-french-fries-fast-food-png-image_15902895.png', 'Golden, crispy, and perfectly salted. The ultimate sidekick for any sandwich or burger always delicious.'),
('Onion Rings / 400kcal', 3.00, 'sides', 'https://media.istockphoto.com/id/518802156/photo/onion-rings.jpg?s=612x612&w=0&k=20&c=SVVifA9O-1cjBgy9bI-YAhcAAI9ohTv34VmOxhFIMpU=', 'Thick-cut onions coated in crispy batter and fried to perfection. Crunchy and crave-worthy goodness.'),
('Salad / 50kcal', 3.00, 'sides', 'https://media.istockphoto.com/id/1090421790/photo/healthy-salad-caesar-in-plastic-package-for-take-away-or-food-delivery-isolated-on-a-white.jpg?s=612x612&w=0&k=20&c=IpDYQJ8IJ1A58TLFCuS16bIXwOtu9VGxAtFNCruRh8E=', 'A light and fresh mix of lettuce, tomatoes, and veggies. Perfect for a lighter fuel option, crisp and refreshing.'),
('Mozzarella Sticks / 500kcal', 3.00, 'sides', 'https://thumbs.dreamstime.com/b/yummy-delicious-mozzarella-sticks-isolated-white-background-yummy-delicious-mozzarella-sticks-isolated-white-363106962.jpg', 'Crispy on the outside, melty on the inside. Served hot with marinara dipping sauce for extra flavor punch!'),

('Chocolate Milkshake / 420kcal', 4.00, 'desserts', 'https://media.istockphoto.com/id/1323536801/photo/italian-frappe-isolated-on-white-background-gianduia-gelato-with-chocolate-topping-and-red.jpg?s=612x612&w=0&k=20&c=PFPa1txgcpqyMZCEsq2xoz00aWEikK0ovd74BJMkL98=', 'Rich, creamy, and full of chocolatey goodness. Blended to perfection for the ultimate sweet refreshment.'),
('Strawberry Sundae / 280kcal', 3.00, 'desserts', 'https://pinoycupidgifts.com/wp-content/uploads/2024/05/strawberry-sundae.jpg', 'Cool vanilla ice cream topped with sweet strawberry syrup and chunks of real strawberries. A fruity finish for your meal!'),
('Chocolate Cookies / 320kcal', 2.00, 'desserts', 'https://media.officedepot.com/images/f_auto,q_auto,e_sharpen,h_450/products/216390/216390_o02/216390', 'Warm, soft, and loaded cookies with melty chocolate chips. Classic comfort in every bite, always delicious.'),
('Carrot Cake / 420kcal', 4.00, 'desserts', 'https://static.vecteezy.com/system/resources/thumbnails/049/390/139/small_2x/delicious-carrot-cake-slice-with-cream-cheese-frosting-and-pecan-toppings-transparent-background-png.png', 'Moist and spiced with a hint of cinnamon, layered with smooth cream cheese frosting, perfectly irresistible.');


-- SALES 

INSERT INTO sales (
  order_code, user_id, customer_name, customer_email,
  items, subtotal, discount, total,
  status, accepted_at, sent_at, received_confirmed_at
) VALUES
(
  '028391', 2, 'Jose M.', 'jose@email.com',
  JSON_ARRAY(
    JSON_OBJECT('product_id', 15, 'name', 'Chocolate Milkshake / 420kcal', 'qty', 1, 'unit_price', 4.00),
    JSON_OBJECT('product_id', 11, 'name', 'French Fries / 300kcal', 'qty', 1, 'unit_price', 3.00),
    JSON_OBJECT('product_id', 1,  'name', 'Pit Stop Classic / 350kcal', 'qty', 1, 'unit_price', 5.00)
  ),
  12.00, 2.00, 10.00,
  'in_progress',
  NOW(), NULL, NULL
),
(
  '774210', NULL, 'Guest Customer', 'guest@email.com',
  JSON_ARRAY(
    JSON_OBJECT('product_id', 16, 'name', 'Strawberry Sundae / 280kcal', 'qty', 2, 'unit_price', 3.00)
  ),
  6.00, 0.00, 6.00,
  'received',
  NULL, NULL, NULL
),
(
  '556677', 2, 'Jose M.', 'jose@email.com',
  JSON_ARRAY(
    JSON_OBJECT('product_id', 2, 'name', 'Turbo Bacon / 450kcal', 'qty', 1, 'unit_price', 7.00),
    JSON_OBJECT('product_id', 11, 'name', 'French Fries / 300kcal', 'qty', 1, 'unit_price', 3.00),
    JSON_OBJECT('product_id', 5, 'name', 'Coke / 150kcal', 'qty', 1, 'unit_price', 2.50)
  ),
  12.50, 2.00, 10.50,
  'sent',
  NOW(), NOW(), NULL
),
(
  '112233', 2, 'Jose M.', 'jose@email.com',
  JSON_ARRAY(
    JSON_OBJECT('product_id', 3, 'name', 'Double Gear / 510kcal', 'qty', 1, 'unit_price', 9.00)
  ),
  9.00, 0.00, 9.00,
  'done',
  NOW(), NOW(), NOW()
);

-- CONTACT US 

INSERT INTO contactUs (name, email, order_code, phone, subject, message, replied, replied_at)
VALUES
('Fabio','fabio@email.com','774210','4245421073','Order not delivered','I need to know about my order, it was supposed to arrive yesterday.',0,NULL),
('Maria Silva','maria@gmail.com',NULL,'5551112222','Payment issue','My card was charged twice and I only placed one order.',0,NULL),
('John Doe','john@yahoo.com','028391',NULL,'Order delay','My order is taking too long, can you check what is going on?',0,NULL),
('Ana Costa','ana.costa@gmail.com','556677','5553339999','Wrong item','I received a different burger than the one I ordered.',0,NULL),
('Lucas Pereira','lucas.p@gmail.com',NULL,'5558887777','App issue','The app crashes every time I try to checkout.',0,NULL),
('Mark Johnson','mark.j@gmail.com','556677','5554441111','Missing item','One item was missing from my order.',1,'2025-12-19 14:32:00'),
('Sofia Martinez','sofia@gmail.com','112233',NULL,'Refund request','I would like a refund for my last order.',1,'2025-12-18 10:15:00');
