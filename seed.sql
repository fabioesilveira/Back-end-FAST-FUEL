USE db_fastFuel;

-- USERS

INSERT INTO
    users (
        fullName,
        phone,
        email,
        password,
        type
    )
VALUES (
        'adm',
        '(11) 9999-8888',
        'fast-fuel@admin.com',
        'adminFF',
        'admin'
    ),
    (
        'Jose M.',
        '(11) 4421-8888',
        'jose@email.com',
        '123456',
        'normal'
    );

-- PRODUCTS

INSERT INTO
    products (
        name,
        price,
        category,
        image,
        description
    )
VALUES (
        'Pit Stop Classic / 350kcal',
        5.00,
        'sandwiches',
        'https://media.istockphoto.com/id/2158592905/photo/beef-patty-burger-with-vegetables-and-lettuce-on-white-background-file-contains-clipping-path.jpg?s=612x612&w=0&k=20&c=1mUN5sPZh5A2SRhAqs3tFrFW9cHhA4REkuUTp1h_9lI=',
        'Juicy grilled beef patty topped with fresh lettuce, ripe tomato, and melted cheese, all served on a toasted bun. Packed with classic flavor. Perfect for a quick fuel-up.'
    ),
    (
        'Turbo Bacon / 450kcal',
        6.00,
        'sandwiches',
        'https://i.ibb.co/VYGzxRYF/x-tudo.jpg',
        'A juicy beef patty stacked with crispy bacon, melted cheese, fresh lettuce, and tomato, finished with our signature sauce. Built to satisfy. Made for those who crave extra flavor.'
    ),
    (
        'Double Gear / 510kcal',
        7.50,
        'sandwiches',
        'https://www.shutterstock.com/image-photo/appetizing-hamburger-cheeseburger-two-patties-600nw-2571312207.jpg',
        'Two beef patties layered with double cheese, fresh lettuce, and tomato for a bigger, bolder bite. Extra layers, extra power, and serious satisfaction. Built for bigger appetites.'
    ),
    (
        'Fuel Monster / 600kcal',
        9.00,
        'sandwiches',
        'https://png.pngtree.com/png-clipart/20250221/original/pngtree-bacon-burger-white-background-png-image_20491350.png',
        'Layered with juicy beef, rich melted cheese, smoky bacon, and bold flavors in every bite. Big, indulgent, and unapologetically satisfying. Made for true fuel champions.'
    ),
    (
        'Coke / 150kcal',
        2.50,
        'beverages',
        'Coke.png',
        '20 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'
    ),
    (
        'Sprite / 140 kcal',
        2.50,
        'beverages',
        'Sprite.png',
        '20 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'
    ),
    (
        'Dr. Pepper / 150kcal',
        2.50,
        'beverages',
        'Drpepper.png',
        '20 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'
    ),
    (
        'Fanta / 160kcal',
        2.50,
        'beverages',
        'Fanta.png',
        '20 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'
    ),
    (
        'Diet Coke / 2kcal',
        2.50,
        'beverages',
        'Dietcoke.png',
        '20 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'
    ),
    (
        'Lemonade / 150kcal',
        2.50,
        'beverages',
        'Lemonade.png',
        '20 fl oz drink, refreshing and full of flavor, perfect to pair with any meal and enjoy that classic, irresistible taste.'
    ),
    (
        'French Fries / 300kcal',
        3.00,
        'sides',
        'https://png.pngtree.com/png-clipart/20240901/original/pngtree-delicious-french-fries-fast-food-png-image_15902895.png',
        'Golden, crispy, and perfectly salted. The ultimate sidekick for any sandwich or burger always delicious, a must-try.'
    ),
    (
        'Onion Rings / 400kcal',
        3.00,
        'sides',
        'https://media.istockphoto.com/id/518802156/photo/onion-rings.jpg?s=612x612&w=0&k=20&c=SVVifA9O-1cjBgy9bI-YAhcAAI9ohTv34VmOxhFIMpU=',
        'Thick-cut onions coated in crispy batter and fried to perfection. Crunchy and crave-worthy goodness.'
    ),
    (
        'Crispy Salad / 250kcal',
        3.00,
        'sides',
        'Crispsalad.png',
        'A light and fresh mix of lettuce, tomatoes, and veggies. Perfect for a lighter fuel option, crisp and refreshing.'
    ),
    (
        'Cheese Sticks / 500kcal',
        3.00,
        'sides',
        'https://thumbs.dreamstime.com/b/yummy-delicious-mozzarella-sticks-isolated-white-background-yummy-delicious-mozzarella-sticks-isolated-white-363106962.jpg',
        'Crispy on the outside, melty on the inside. Served hot with marinara dipping sauce for extra flavor punch!'
    ),
    (
        'Chocolate Milkshake / 420kcal',
        4.00,
        'desserts',
        'Milkshake.png',
        'Rich, creamy, and full of chocolatey goodness. Blended to perfection for the ultimate sweet refreshment.'
    ),
    (
        'Strawberry Sundae / 280kcal',
        3.00,
        'desserts',
        'Sundae.png',
        'Cool vanilla ice cream topped with sweet strawberry syrup and chunks of real strawberries. A fruity finish for your meal!'
    ),
    (
        'Chocolate Cookies / 320kcal',
        2.00,
        'desserts',
        'https://media.officedepot.com/images/f_auto,q_auto,e_sharpen,h_450/products/216390/216390_o02/216390',
        'Warm, soft, and loaded cookies with melty chocolate chips. Classic comfort in every bite, always delicious.'
    ),
    (
        'Carrot Cake / 420kcal',
        4.00,
        'desserts',
        'https://static.vecteezy.com/system/resources/thumbnails/049/390/139/small_2x/delicious-carrot-cake-slice-with-cream-cheese-frosting-and-pecan-toppings-transparent-background-png.png',
        'Moist and spiced with a hint of cinnamon, layered with smooth cream cheese frosting, perfectly irresistible, a must-try.'
    );

-- SALES

INSERT INTO
    sales (
        order_code,
        user_id,
        customer_name,
        customer_email,
        delivery_address,
        payment_method,
        payment_status,
        payment_ref,
        items,
        items_snapshot,
        subtotal,
        discount,
        tax,
        delivery_fee,
        total,
        status,
        accepted_at,
        sent_at,
        received_confirmed_at
    )
VALUES (
        '028391',
        2,
        'Jose M.',
        'jose@email.com',
        JSON_OBJECT(
            'street',
            '123 Market St',
            'apt',
            '12B',
            'city',
            'San Jose',
            'state',
            'CA',
            'zip',
            '95112',
            'country',
            'USA'
        ),
        'card',
        'approved',
        'SIM-AAAA11',
        JSON_ARRAY(
            JSON_OBJECT('id', '15', 'qty', 1),
            JSON_OBJECT('id', '11', 'qty', 1),
            JSON_OBJECT('id', '1', 'qty', 1),
            JSON_OBJECT('id', '5', 'qty', 1)
        ),
        JSON_ARRAY(
            JSON_OBJECT(
                'id',
                '15',
                'name',
                'Chocolate Milkshake / 420kcal',
                'price',
                4.00,
                'category',
                'desserts',
                'image',
                'Milkshake.png',
                'qty',
                1
            ),
            JSON_OBJECT(
                'id',
                '11',
                'name',
                'French Fries / 300kcal',
                'price',
                3.00,
                'category',
                'sides',
                'image',
                'https://png.pngtree.com/png-clipart/20240901/original/pngtree-delicious-french-fries-fast-food-png-image_15902895.png',
                'qty',
                1
            ),
            JSON_OBJECT(
                'id',
                '1',
                'name',
                'Pit Stop Classic / 350kcal',
                'price',
                5.00,
                'category',
                'sandwiches',
                'image',
                'https://media.istockphoto.com/id/2158592905/photo/beef-patty-burger-with-vegetables-and-lettuce-on-white-background-file-contains-clipping-path.jpg?s=612x612&w=0&k=20&c=1mUN5sPZh5A2SRhAqs3tFrFW9cHhA4REkuUTp1h_9lI=',
                'qty',
                1
            ),
            JSON_OBJECT(
                'id',
                '5',
                'name',
                'Coke / 150kcal',
                'price',
                2.50,
                'category',
                'beverages',
                'image',
                'Coke.png',
                'qty',
                1
            )
        ),
        14.50,
        2.00,
        1.13,
        9.99,
        23.62,
        'in_progress',
        NOW(),
        NULL,
        NULL
    ),
    (
        '774210',
        NULL,
        'Guest Customer',
        'guest@email.com',
        JSON_OBJECT(
            'street',
            '500 King Rd',
            'apt',
            '',
            'city',
            'San Jose',
            'state',
            'CA',
            'zip',
            '95116',
            'country',
            'USA'
        ),
        'cash',
        'pending',
        'SIM-BBBB22',
        JSON_ARRAY(
            JSON_OBJECT('id', '16', 'qty', 2)
        ),
        JSON_ARRAY(
            JSON_OBJECT(
                'id',
                '16',
                'name',
                'Strawberry Sundae / 280kcal',
                'price',
                3.00,
                'category',
                'desserts',
                'image',
                'Sundae.png',
                'qty',
                2
            )
        ),
        6.00,
        0.00,
        0.54,
        9.99,
        16.53,
        'received',
        NULL,
        NULL,
        NULL
    ),
    (
        '556677',
        2,
        'Jose M.',
        'jose@email.com',
        JSON_OBJECT(
            'street',
            '88 Santa Clara St',
            'apt',
            '7',
            'city',
            'San Jose',
            'state',
            'CA',
            'zip',
            '95113',
            'country',
            'USA'
        ),
        'apple_pay',
        'approved',
        'SIM-CCCC33',
        JSON_ARRAY(
            JSON_OBJECT('id', '2', 'qty', 1),
            JSON_OBJECT('id', '11', 'qty', 1),
            JSON_OBJECT('id', '5', 'qty', 1)
        ),
        JSON_ARRAY(
            JSON_OBJECT(
                'id',
                '2',
                'name',
                'Turbo Bacon / 450kcal',
                'price',
                6.00,
                'category',
                'sandwiches',
                'image',
                'https://i.ibb.co/VYGzxRYF/x-tudo.jpg',
                'qty',
                1
            ),
            JSON_OBJECT(
                'id',
                '11',
                'name',
                'French Fries / 300kcal',
                'price',
                3.00,
                'category',
                'sides',
                'image',
                'https://png.pngtree.com/png-clipart/20240901/original/pngtree-delicious-french-fries-fast-food-png-image_15902895.png',
                'qty',
                1
            ),
            JSON_OBJECT(
                'id',
                '5',
                'name',
                'Coke / 150kcal',
                'price',
                2.50,
                'category',
                'beverages',
                'image',
                'Coke.png',
                'qty',
                1
            )
        ),
        11.50,
        2.00,
        0.86,
        9.99,
        20.35,
        'sent',
        NOW(),
        NOW(),
        NULL
    ),
    (
        '112233',
        2,
        'Jose M.',
        'jose@email.com',
        JSON_OBJECT(
            'street',
            '1 Infinite Loop',
            'apt',
            '',
            'city',
            'Cupertino',
            'state',
            'CA',
            'zip',
            '95014',
            'country',
            'USA'
        ),
        'google_pay',
        'approved',
        'SIM-DDDD44',
        JSON_ARRAY(
            JSON_OBJECT('id', '3', 'qty', 1)
        ),
        JSON_ARRAY(
            JSON_OBJECT(
                'id',
                '3',
                'name',
                'Double Gear / 510kcal',
                'price',
                7.50,
                'category',
                'sandwiches',
                'image',
                'https://www.shutterstock.com/image-photo/appetizing-hamburger-cheeseburger-two-patties-600nw-2571312207.jpg',
                'qty',
                1
            )
        ),
        7.50,
        0.00,
        0.68,
        9.99,
        18.17,
        'completed',
        NOW(),
        NOW(),
        NOW()
    );

-- CONTACT US

INSERT INTO
    contactUs (
        name,
        email,
        order_code,
        phone,
        subject,
        message,
        replied,
        replied_at
    )
VALUES (
        'Fabio',
        'fabio@email.com',
        '774210',
        '4245421073',
        'Order not delivered',
        'I need to know about my order, it was supposed to arrive 15 minutes ago.',
        0,
        NULL
    ),
    (
        'Maria Silva',
        'maria@gmail.com',
        NULL,
        '5551112222',
        'Payment issue',
        'My card was charged twice and I only placed one order.',
        0,
        NULL
    ),
    (
        'John Doe',
        'john@yahoo.com',
        '028391',
        NULL,
        'Order delay',
        'My order is taking too long, can you check what is going on?',
        0,
        NULL
    ),
    (
        'Ana Costa',
        'ana.costa@gmail.com',
        '556677',
        '5553339999',
        'Wrong item',
        'I received a different burger than the one I ordered.',
        0,
        NULL
    ),
    (
        'Lucas Pereira',
        'lucas.p@gmail.com',
        NULL,
        '5558887777',
        'App issue',
        'The app crashes every time I try to checkout.',
        0,
        NULL
    ),
    (
        'Mark Johnson',
        'mark.j@gmail.com',
        '556677',
        '5554441111',
        'Missing item',
        'One item was missing from my order.',
        1,
        '2025-12-19 14:32:00'
    ),
    (
        'Sofia Martinez',
        'sofia@gmail.com',
        '112233',
        NULL,
        'Refund request',
        'I would like a refund for my last order.',
        1,
        '2025-12-18 10:15:00'
    );