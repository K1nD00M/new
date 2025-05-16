const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { isAuthenticated } = require('./middleware/auth');
const { SqliteGuiNode } = require('sqlite-gui-node');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'db', 'hotel.db');
const db = new sqlite3.Database(dbPath);
const methodOverride = require('method-override');

const guests = require('./db/queries/guests');
const rooms = require('./db/queries/rooms');
const bookings = require('./db/queries/bookings');
const services = require('./db/queries/services');
const serviceCategories = require('./db/queries/service_categories');
const serviceOrders = require('./db/queries/service_orders');
const reviews = require('./db/queries/reviews');
const statuses = require('./db/queries/statuses');
const roomTypes = require('./db/queries/room_types');
const users = require('./db/queries/users');

const app = express();

// Логирование всех запросов
if (!fs.existsSync('logs')) fs.mkdirSync('logs');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Инициализируем SQLite GUI на порту 3001 с конфигурацией
SqliteGuiNode(db, 3001, {
    tableNames: {
        'guests': {
            primaryKey: 'id',
            displayName: 'Guests'
        },
        'rooms': {
            primaryKey: 'id',
            displayName: 'Rooms'
        },
        'bookings': {
            primaryKey: 'id',
            displayName: 'Bookings'
        },
        'booking_status': {
            primaryKey: 'id',
            displayName: 'Booking Status'
        },
        'room_types': {
            primaryKey: 'id',
            displayName: 'Room Types'
        },
        'services': {
            primaryKey: 'id',
            displayName: 'Services'
        },
        'service_categories': {
            primaryKey: 'id',
            displayName: 'Service Categories'
        },
        'service_orders': {
            primaryKey: 'id',
            displayName: 'Service Orders'
        },
        'reviews': {
            primaryKey: 'id',
            displayName: 'Reviews'
        },
        'loyalty_program': {
            primaryKey: 'id',
            displayName: 'Loyalty Program'
        },
        'users': {
            primaryKey: 'id',
            displayName: 'Users'
        }
    }
}).catch((err) => {
    console.error('Error starting the GUI:', err);
});

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Главная страница
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', { user: req.session.user });
});

// Гости
app.get('/guests', isAuthenticated, (req, res) => {
    const fio = req.query.fio;
    if (fio) {
        const sqlite3 = require('sqlite3').verbose();
        const dbPath = require('path').join(__dirname, 'db', 'hotel.db');
        const dbConn = new sqlite3.Database(dbPath);
        dbConn.all('SELECT * FROM guests WHERE full_name LIKE ?', [`%${fio}%`], (err, rows) => {
            dbConn.close();
            if (err) return res.status(500).send('Ошибка БД');
            res.render('guests/index', { guests: rows, query: fio });
        });
    } else {
        guests.getAllGuests((err, guestsList) => {
            if (err) return res.status(500).send('Ошибка БД');
            res.render('guests/index', { guests: guestsList });
        });
    }
});

// Номера
app.get('/rooms', isAuthenticated, (req, res) => {
    rooms.getAllRooms((err, roomsList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('rooms/index', { rooms: roomsList });
    });
});

// Бронирования
app.get('/bookings', isAuthenticated, (req, res) => {
    bookings.getAllBookings((err, bookingsList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('bookings/index', { bookings: bookingsList });
    });
});

// Услуги
app.get('/services', isAuthenticated, (req, res) => {
    services.getAllServices((err, servicesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('services/index', { services: servicesList });
    });
});

// Категории услуг
app.get('/service_categories', isAuthenticated, (req, res) => {
    serviceCategories.getAllServiceCategories((err, categoriesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('service_categories/index', { serviceCategories: categoriesList });
    });
});

// Заказы услуг
app.get('/service_orders', isAuthenticated, (req, res) => {
    serviceOrders.getAllServiceOrders((err, ordersList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('service_orders/index', { serviceOrders: ordersList });
    });
});

// Отзывы
app.get('/reviews', isAuthenticated, (req, res) => {
    reviews.getAllReviews((err, reviewsList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('reviews/index', { reviews: reviewsList });
    });
});

// Статусы брони
app.get('/statuses', isAuthenticated, (req, res) => {
    statuses.getAllStatuses((err, statusesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('statuses/index', { statuses: statusesList });
    });
});

// Типы номеров
app.get('/room_types', isAuthenticated, (req, res) => {
    roomTypes.getAllRoomTypes((err, roomTypesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('room_types/index', { roomTypes: roomTypesList });
    });
});

// --- Гости ---
app.get('/guests/new', isAuthenticated, (req, res) => {
    res.render('guests/new');
});
// --- Номера ---
app.get('/rooms/new', isAuthenticated, (req, res) => {
    res.render('rooms/new');
});
// --- Бронирования ---
app.get('/bookings/new', isAuthenticated, (req, res) => {
    res.render('bookings/new');
});
// --- Услуги ---
app.get('/services/new', isAuthenticated, (req, res) => {
    res.render('services/new');
});
// --- Категории услуг ---
app.get('/service_categories/new', isAuthenticated, (req, res) => {
    res.render('service_categories/new');
});
// --- Заказы услуг ---
app.get('/service_orders/new', isAuthenticated, (req, res) => {
    res.render('service_orders/new');
});
// --- Отзывы ---
app.get('/reviews/new', isAuthenticated, (req, res) => {
    res.render('reviews/new');
});
// --- Статусы брони ---
app.get('/statuses/new', isAuthenticated, (req, res) => {
    res.render('statuses/new');
});
// --- Типы номеров ---
app.get('/room_types/new', isAuthenticated, (req, res) => {
    res.render('room_types/new');
});

// --- Гости ---
app.get('/guests/:id/edit', isAuthenticated, (req, res) => {
    guests.getGuestById(req.params.id, (err, guest) => {
        if (err) return res.status(500).send('Ошибка БД');
        if (!guest) return res.status(404).send('Гость не найден');
        res.render('guests/edit', { guest });
    });
});

// --- Номера ---
app.get('/rooms/:id/edit', isAuthenticated, (req, res) => {
    rooms.getRoomById(req.params.id, (err, room) => {
        if (err) return res.status(500).send('Ошибка БД');
        if (!room) return res.status(404).send('Номер не найден');
        res.render('rooms/edit', { room });
    });
});

// --- Бронирования ---
app.get('/bookings/:id/edit', isAuthenticated, (req, res) => {
    bookings.getBookingById(req.params.id, (err, booking) => {
        if (err) return res.status(500).send('Ошибка БД');
        if (!booking) return res.status(404).send('Бронирование не найдено');
        res.render('bookings/edit', { booking });
    });
});

// --- Услуги ---
app.get('/services/:id/edit', isAuthenticated, (req, res) => {
    services.getServiceById(req.params.id, (err, service) => {
        if (err) return res.status(500).send('Ошибка БД');
        if (!service) return res.status(404).send('Услуга не найдена');
        res.render('services/edit', { service });
    });
});

// --- Категории услуг ---
app.get('/service_categories/:id/edit', isAuthenticated, (req, res) => {
    serviceCategories.getServiceCategoryById(req.params.id, (err, category) => {
        if (err) return res.status(500).send('Ошибка БД');
        if (!category) return res.status(404).send('Категория не найдена');
        res.render('service_categories/edit', { category });
    });
});

// --- Заказы услуг ---
app.get('/service_orders/:id/edit', isAuthenticated, (req, res) => {
    serviceOrders.getServiceOrderById(req.params.id, (err, order) => {
        if (err) return res.status(500).send('Ошибка БД');
        if (!order) return res.status(404).send('Заказ не найден');
        res.render('service_orders/edit', { order });
    });
});

// --- Типы номеров ---
app.get('/room_types/:id/edit', isAuthenticated, (req, res) => {
    roomTypes.getRoomTypeById(req.params.id, (err, type) => {
        if (err) return res.status(500).send('Ошибка БД');
        if (!type) return res.status(404).send('Тип номера не найден');
        res.render('room_types/edit', { type });
    });
});

// Заглушка для главной страницы
app.get('/', (req, res) => {
    res.send('<h1>Добро пожаловать в систему управления гостиницей!</h1>');
});

// --- Гости ---
app.post('/guests', isAuthenticated, (req, res) => {
    guests.addGuest(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении гостя. Проверьте корректность данных и связей.');
        res.redirect('/guests');
    });
});
// --- Номера ---
app.post('/rooms', isAuthenticated, (req, res) => {
    rooms.addRoom(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении номера. Проверьте корректность данных и связей.');
        res.redirect('/rooms');
    });
});
// --- Бронирования ---
app.post('/bookings', isAuthenticated, (req, res) => {
    bookings.addBooking(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении бронирования. Проверьте корректность данных и связей.');
        res.redirect('/bookings');
    });
});
// --- Услуги ---
app.post('/services', isAuthenticated, (req, res) => {
    services.addService(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении услуги. Проверьте корректность данных и связей.');
        res.redirect('/services');
    });
});
// --- Категории услуг ---
app.post('/service_categories', isAuthenticated, (req, res) => {
    serviceCategories.addServiceCategory(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении категории услуги. Проверьте корректность данных и связей.');
        res.redirect('/service_categories');
    });
});
// --- Заказы услуг ---
app.post('/service_orders', isAuthenticated, (req, res) => {
    serviceOrders.addServiceOrder(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении заказа услуги. Проверьте корректность данных и связей.');
        res.redirect('/service_orders');
    });
});
// --- Отзывы ---
app.post('/reviews', isAuthenticated, (req, res) => {
    reviews.addReview(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении отзыва. Проверьте корректность данных и связей.');
        res.redirect('/reviews');
    });
});
// --- Статусы брони ---
app.post('/statuses', isAuthenticated, (req, res) => {
    statuses.addStatus(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении статуса брони. Проверьте корректность данных и связей.');
        res.redirect('/statuses');
    });
});
// --- Типы номеров ---
app.post('/room_types', isAuthenticated, (req, res) => {
    roomTypes.addRoomType(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении типа номера. Проверьте корректность данных и связей.');
        res.redirect('/room_types');
    });
});

// --- Гости ---
app.put('/guests/:id', isAuthenticated, (req, res) => {
    guests.updateGuest(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении гостя');
        res.redirect('/guests');
    });
});

// --- Номера ---
app.put('/rooms/:id', isAuthenticated, (req, res) => {
    rooms.updateRoom(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении номера');
        res.redirect('/rooms');
    });
});

// --- Бронирования ---
app.put('/bookings/:id', isAuthenticated, (req, res) => {
    bookings.updateBooking(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении бронирования');
        res.redirect('/bookings');
    });
});

// --- Услуги ---
app.put('/services/:id', isAuthenticated, (req, res) => {
    services.updateService(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении услуги');
        res.redirect('/services');
    });
});

// --- Категории услуг ---
app.put('/service_categories/:id', isAuthenticated, (req, res) => {
    serviceCategories.updateServiceCategory(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении категории услуги');
        res.redirect('/service_categories');
    });
});

// --- Заказы услуг ---
app.put('/service_orders/:id', isAuthenticated, (req, res) => {
    serviceOrders.updateServiceOrder(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении заказа услуги');
        res.redirect('/service_orders');
    });
});

// --- Отзывы ---
app.put('/reviews/:id', isAuthenticated, (req, res) => {
    reviews.updateReview(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении отзыва');
        res.redirect('/reviews');
    });
});

// --- Типы номеров ---
app.put('/room_types/:id', isAuthenticated, (req, res) => {
    roomTypes.updateRoomType(req.params.id, req.body, (err) => {
        if (err) return res.status(500).send('Ошибка при обновлении типа номера');
        res.redirect('/room_types');
    });
});

// --- Гости ---
app.delete('/guests/:id', isAuthenticated, (req, res) => {
    guests.deleteGuest(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении гостя');
        res.redirect('/guests');
    });
});

// --- Номера ---
app.delete('/rooms/:id', isAuthenticated, (req, res) => {
    rooms.deleteRoom(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении номера');
        res.redirect('/rooms');
    });
});

// --- Бронирования ---
app.delete('/bookings/:id', isAuthenticated, (req, res) => {
    bookings.deleteBooking(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении бронирования');
        res.redirect('/bookings');
    });
});

// --- Услуги ---
app.delete('/services/:id', isAuthenticated, (req, res) => {
    services.deleteService(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении услуги');
        res.redirect('/services');
    });
});

// --- Категории услуг ---
app.post('/service_categories/:id/delete', isAuthenticated, (req, res) => {
    serviceCategories.deleteServiceCategory(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении категории услуги');
        res.redirect('/service_categories');
    });
});

// --- Заказы услуг ---
app.delete('/service_orders/:id', isAuthenticated, (req, res) => {
    serviceOrders.deleteServiceOrder(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении заказа услуги');
        res.redirect('/service_orders');
    });
});

// --- Отзывы ---
app.delete('/reviews/:id', isAuthenticated, (req, res) => {
    reviews.deleteReview(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении отзыва');
        res.redirect('/reviews');
    });
});

// --- Типы номеров ---
app.delete('/room_types/:id', isAuthenticated, (req, res) => {
    roomTypes.deleteRoomType(req.params.id, (err) => {
        if (err) return res.status(500).send('Ошибка при удалении типа номера');
        res.redirect('/room_types');
    });
});

// Регистрация
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Проверяем, что все поля заполнены
        if (!username || !password) {
            return res.status(400).render('register', { 
                error: 'Все поля должны быть заполнены' 
            });
        }

        // Хешируем пароль
        const hash = await bcrypt.hash(password, 10);
        
        // Добавляем пользователя
        users.addUser(username, hash, (err) => {
            if (err) {
                console.error('Ошибка при регистрации:', err);
                return res.status(400).render('register', { 
                    error: 'Пользователь уже существует или произошла ошибка' 
                });
            }
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).render('register', { 
            error: 'Произошла ошибка при регистрации' 
        });
    }
});

// Вход
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Проверяем, что все поля заполнены
        if (!username || !password) {
            return res.status(400).render('login', { 
                error: 'Все поля должны быть заполнены' 
            });
        }

        users.getUserByUsername(username, async (err, user) => {
            if (err) {
                console.error('Ошибка при входе:', err);
                return res.status(500).render('login', { 
                    error: 'Произошла ошибка при входе' 
                });
            }
            
            if (!user) {
                return res.status(400).render('login', { 
                    error: 'Неверные учетные данные' 
                });
            }

            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                return res.status(400).render('login', { 
                    error: 'Неверные учетные данные' 
                });
            }

            req.session.user = user;
            
            // Редирект на сохраненный URL или на главную
            const returnTo = req.session.returnTo || '/';
            delete req.session.returnTo; // Очищаем сохраненный URL
            res.redirect(returnTo);
        });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).render('login', { 
            error: 'Произошла ошибка при входе' 
        });
    }
});

// Выход
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Ошибка при выходе:', err);
        }
        res.redirect('/login');
    });
});

app.listen(3000, () => {
    const PORT = process.env.PORT || 3000;
    console.log(`Server started on http://localhost:${PORT}`);
}); 