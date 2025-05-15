const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '..', 'hotel.db');

function readSQL(filename) {
    return fs.readFileSync(path.join(__dirname, 'room_types', filename), 'utf-8');
}

function getAllRoomTypes(callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_all.sql');
    db.all(sql, [], (err, rows) => {
        db.close();
        callback(err, rows);
    });
}

function getRoomTypeById(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_by_id.sql');
    db.get(sql, [id], (err, row) => {
        db.close();
        callback(err, row);
    });
}

function addRoomType(roomType, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('insert.sql');
    const params = [roomType.название_типа, roomType.описание, roomType.базовая_цена];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.lastID : null);
    });
}

function updateRoomType(id, roomType, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('update.sql');
    const params = [roomType.название_типа, roomType.описание, roomType.базовая_цена, id];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

function deleteRoomType(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('delete.sql');
    db.run(sql, [id], function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

module.exports = {
    getAllRoomTypes,
    getRoomTypeById,
    addRoomType,
    updateRoomType,
    deleteRoomType
}; 