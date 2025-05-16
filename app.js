const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const guests = require('./db/queries/guests');
const rooms = require('./db/queries/rooms');
const bookings = require('./db/queries/bookings');
const services = require('./db/queries/services');
const serviceCategories = require('./db/queries/service_categories');
const serviceOrders = require('./db/queries/service_orders');
const reviews = require('./db/queries/reviews');
const statuses = require('./db/queries/statuses');
const roomTypes = require('./db/queries/room_types');

const app = express();

// Логирование всех запросов
if (!fs.existsSync('logs')) fs.mkdirSync('logs');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Главная страница
app.get('/', (req, res) => {
    res.render('index');
});

// Гости
app.get('/guests', (req, res) => {
    const fio = req.query.fio;
    if (fio) {
        const sqlite3 = require('sqlite3').verbose();
        const dbPath = require('path').join(__dirname, 'db', 'hotel.db');
        const dbConn = new sqlite3.Database(dbPath);
        dbConn.all('SELECT * FROM Гости WHERE ФИО LIKE ?', [`%${fio}%`], (err, rows) => {
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
app.get('/rooms', (req, res) => {
    rooms.getAllRooms((err, roomsList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('rooms/index', { rooms: roomsList });
    });
});

// Бронирования
app.get('/bookings', (req, res) => {
    bookings.getAllBookings((err, bookingsList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('bookings/index', { bookings: bookingsList });
    });
});

// Услуги
app.get('/services', (req, res) => {
    services.getAllServices((err, servicesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('services/index', { services: servicesList });
    });
});

// Категории услуг
app.get('/service_categories', (req, res) => {
    serviceCategories.getAllServiceCategories((err, categoriesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('service_categories/index', { serviceCategories: categoriesList });
    });
});

// Заказы услуг
app.get('/service_orders', (req, res) => {
    serviceOrders.getAllServiceOrders((err, ordersList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('service_orders/index', { serviceOrders: ordersList });
    });
});

// Отзывы
app.get('/reviews', (req, res) => {
    reviews.getAllReviews((err, reviewsList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('reviews/index', { reviews: reviewsList });
    });
});

// Статусы брони
app.get('/statuses', (req, res) => {
    statuses.getAllStatuses((err, statusesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('statuses/index', { statuses: statusesList });
    });
});

// Типы номеров
app.get('/room_types', (req, res) => {
    roomTypes.getAllRoomTypes((err, roomTypesList) => {
        if (err) return res.status(500).send('Ошибка БД');
        res.render('room_types/index', { roomTypes: roomTypesList });
    });
});

// --- Гости ---
app.get('/guests/new', (req, res) => {
    res.render('guests/new');
});
// --- Номера ---
app.get('/rooms/new', (req, res) => {
    res.render('rooms/new');
});
// --- Бронирования ---
app.get('/bookings/new', (req, res) => {
    res.render('bookings/new');
});
// --- Услуги ---
app.get('/services/new', (req, res) => {
    res.render('services/new');
});
// --- Категории услуг ---
app.get('/service_categories/new', (req, res) => {
    res.render('service_categories/new');
});
// --- Заказы услуг ---
app.get('/service_orders/new', (req, res) => {
    res.render('service_orders/new');
});
// --- Отзывы ---
app.get('/reviews/new', (req, res) => {
    res.render('reviews/new');
});
// --- Статусы брони ---
app.get('/statuses/new', (req, res) => {
    res.render('statuses/new');
});
// --- Типы номеров ---
app.get('/room_types/new', (req, res) => {
    res.render('room_types/new');
});

// Заглушка для главной страницы
app.get('/', (req, res) => {
    res.send('<h1>Добро пожаловать в систему управления гостиницей!</h1>');
});

// --- Гости ---
app.post('/guests', (req, res) => {
    guests.addGuest(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении гостя. Проверьте корректность данных и связей.');
        res.redirect('/guests');
    });
});
// --- Номера ---
app.post('/rooms', (req, res) => {
    rooms.addRoom(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении номера. Проверьте корректность данных и связей.');
        res.redirect('/rooms');
    });
});
// --- Бронирования ---
app.post('/bookings', (req, res) => {
    bookings.addBooking(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении бронирования. Проверьте корректность данных и связей.');
        res.redirect('/bookings');
    });
});
// --- Услуги ---
app.post('/services', (req, res) => {
    services.addService(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении услуги. Проверьте корректность данных и связей.');
        res.redirect('/services');
    });
});
// --- Категории услуг ---
app.post('/service_categories', (req, res) => {
    serviceCategories.addServiceCategory(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении категории услуги. Проверьте корректность данных и связей.');
        res.redirect('/service_categories');
    });
});
// --- Заказы услуг ---
app.post('/service_orders', (req, res) => {
    serviceOrders.addServiceOrder(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении заказа услуги. Проверьте корректность данных и связей.');
        res.redirect('/service_orders');
    });
});
// --- Отзывы ---
app.post('/reviews', (req, res) => {
    reviews.addReview(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении отзыва. Проверьте корректность данных и связей.');
        res.redirect('/reviews');
    });
});
// --- Статусы брони ---
app.post('/statuses', (req, res) => {
    statuses.addStatus(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении статуса брони. Проверьте корректность данных и связей.');
        res.redirect('/statuses');
    });
});
// --- Типы номеров ---
app.post('/room_types', (req, res) => {
    roomTypes.addRoomType(req.body, (err) => {
        if (err) return res.status(400).send('Ошибка при добавлении типа номера. Проверьте корректность данных и связей.');
        res.redirect('/room_types');
    });
});

app.listen(3000, () => {
    const PORT = process.env.PORT || 3000;
    console.log(`Server started on http://localhost:${PORT}`);
}); 