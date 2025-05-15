const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '..', 'hotel.db');

function readSQL(filename) {
    return fs.readFileSync(path.join(__dirname, 'services', filename), 'utf-8');
}

function getAllServices(callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_all.sql');
    db.all(sql, [], (err, rows) => {
        db.close();
        callback(err, rows);
    });
}

function getServiceById(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_by_id.sql');
    db.get(sql, [id], (err, row) => {
        db.close();
        callback(err, row);
    });
}

function addService(service, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('insert.sql');
    const params = [service.название, service.описание, service.цена, service.id_категория];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.lastID : null);
    });
}

function updateService(id, service, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('update.sql');
    const params = [service.название, service.описание, service.цена, service.id_категория, id];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

function deleteService(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('delete.sql');
    db.run(sql, [id], function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

module.exports = {
    getAllServices,
    getServiceById,
    addService,
    updateService,
    deleteService
}; 