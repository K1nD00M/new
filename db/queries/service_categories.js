const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '..', 'hotel.db');

function readSQL(filename) {
    return fs.readFileSync(path.join(__dirname, 'service_categories', filename), 'utf-8');
}

function getAllServiceCategories(callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_all.sql');
    db.all(sql, [], (err, rows) => {
        db.close();
        callback(err, rows);
    });
}

function getServiceCategoryById(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_by_id.sql');
    db.get(sql, [id], (err, row) => {
        db.close();
        callback(err, row);
    });
}

function addServiceCategory(category, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('insert.sql');
    const params = [category.название, category.описание];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.lastID : null);
    });
}

function updateServiceCategory(id, category, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('update.sql');
    const params = [category.название, category.описание, id];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

function deleteServiceCategory(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('delete.sql');
    db.run(sql, [id], function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

module.exports = {
    getAllServiceCategories,
    getServiceCategoryById,
    addServiceCategory,
    updateServiceCategory,
    deleteServiceCategory
}; 