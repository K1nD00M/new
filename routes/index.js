const express = require('express');
const router = express.Router();
const db = require('../db');

// ... existing code ...

// Маршруты для удаления записей
router.post('/guests/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM guests WHERE id = $1', [req.params.id]);
        res.redirect('/guests');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/rooms/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM rooms WHERE id = $1', [req.params.id]);
        res.redirect('/rooms');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/bookings/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
        res.redirect('/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/reviews/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/services/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM services WHERE id = $1', [req.params.id]);
        res.redirect('/services');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/service_categories/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM service_categories WHERE id = $1', [req.params.id]);
        res.redirect('/service_categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/service_orders/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM service_orders WHERE id = $1', [req.params.id]);
        res.redirect('/service_orders');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/room_types/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM room_types WHERE id = $1', [req.params.id]);
        res.redirect('/room_types');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршруты для редактирования записей
router.get('/guests/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM guests WHERE id = $1', [req.params.id]);
        res.render('guests/edit', { guest: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/rooms/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM rooms WHERE id = $1', [req.params.id]);
        res.render('rooms/edit', { room: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/bookings/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
        res.render('bookings/edit', { booking: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/reviews/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM reviews WHERE id = $1', [req.params.id]);
        res.render('reviews/edit', { review: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/services/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM services WHERE id = $1', [req.params.id]);
        res.render('services/edit', { service: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/service_categories/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM service_categories WHERE id = $1', [req.params.id]);
        res.render('service_categories/edit', { category: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/service_orders/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM service_orders WHERE id = $1', [req.params.id]);
        res.render('service_orders/edit', { order: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/room_types/:id/edit', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM room_types WHERE id = $1', [req.params.id]);
        res.render('room_types/edit', { type: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршруты для обновления записей
router.post('/guests/:id', async (req, res) => {
    try {
        const { full_name, phone, email, passport, registration_date, check_in_date, status, points } = req.body;
        await db.query(
            'UPDATE guests SET full_name = $1, phone = $2, email = $3, passport = $4, registration_date = $5, check_in_date = $6, status = $7, points = $8 WHERE id = $9',
            [full_name, phone, email, passport, registration_date, check_in_date, status, points, req.params.id]
        );
        res.redirect('/guests');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/rooms/:id', async (req, res) => {
    try {
        const { room_number, room_type_id, price_per_night, capacity, status, review } = req.body;
        await db.query(
            'UPDATE rooms SET room_number = $1, room_type_id = $2, price_per_night = $3, capacity = $4, status = $5, review = $6 WHERE id = $7',
            [room_number, room_type_id, price_per_night, capacity, status, review, req.params.id]
        );
        res.redirect('/rooms');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/bookings/:id', async (req, res) => {
    try {
        const { room_id, guest_id, check_in_date, check_out_date, status_id, total_price, discount, guest_count } = req.body;
        await db.query(
            'UPDATE bookings SET room_id = $1, guest_id = $2, check_in_date = $3, check_out_date = $4, status_id = $5, total_price = $6, discount = $7, guest_count = $8 WHERE id = $9',
            [room_id, guest_id, check_in_date, check_out_date, status_id, total_price, discount, guest_count, req.params.id]
        );
        res.redirect('/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/reviews/:id', async (req, res) => {
    try {
        const { guest_name, rating, comment, review_date, response, response_date } = req.body;
        await db.query(
            'UPDATE reviews SET guest_name = $1, rating = $2, comment = $3, review_date = $4, response = $5, response_date = $6 WHERE id = $7',
            [guest_name, rating, comment, review_date, response, response_date, req.params.id]
        );
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/services/:id', async (req, res) => {
    try {
        const { name, description, price, category_id } = req.body;
        await db.query(
            'UPDATE services SET name = $1, description = $2, price = $3, category_id = $4 WHERE id = $5',
            [name, description, price, category_id, req.params.id]
        );
        res.redirect('/services');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/service_categories/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        await db.query(
            'UPDATE service_categories SET name = $1, description = $2 WHERE id = $3',
            [name, description, req.params.id]
        );
        res.redirect('/service_categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/service_orders/:id', async (req, res) => {
    try {
        const { booking_id, service_id, quantity, order_date, total_price } = req.body;
        await db.query(
            'UPDATE service_orders SET booking_id = $1, service_id = $2, quantity = $3, order_date = $4, total_price = $5 WHERE id = $6',
            [booking_id, service_id, quantity, order_date, total_price, req.params.id]
        );
        res.redirect('/service_orders');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/room_types/:id', async (req, res) => {
    try {
        const { name, description, base_price } = req.body;
        await db.query(
            'UPDATE room_types SET name = $1, description = $2, base_price = $3 WHERE id = $4',
            [name, description, base_price, req.params.id]
        );
        res.redirect('/room_types');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router; 