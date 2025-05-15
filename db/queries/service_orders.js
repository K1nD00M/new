const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '..', 'hotel.db');

function readSQL(filename) {
    return fs.readFileSync(path.join(__dirname, 'service_orders', filename), 'utf-8');
}

function getAllServiceOrders(callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_all.sql');
    db.all(sql, [], (err, rows) => {
        db.close();
        callback(err, rows);
    });
}

function getServiceOrderById(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_by_id.sql');
    db.get(sql, [id], (err, row) => {
        db.close();
        callback(err, row);
    });
}

function addServiceOrder(order, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('insert.sql');
    const params = [order.id_бронь, order.id_услуга, order.дата_заказа, order.сумма, order.статус];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.lastID : null);
    });
}

function updateServiceOrder(id, order, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('update.sql');
    const params = [order.id_бронь, order.id_услуга, order.дата_заказа, order.сумма, order.статус, id];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

function deleteServiceOrder(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('delete.sql');
    db.run(sql, [id], function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

module.exports = {
    getAllServiceOrders,
    getServiceOrderById,
    addServiceOrder,
    updateServiceOrder,
    deleteServiceOrder
}; 