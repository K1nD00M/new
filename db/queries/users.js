const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'hotel.db');

function findUserByUsername(username, callback) {
    const db = new sqlite3.Database(dbPath);
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        db.close();
        callback(err, row);
    });
}

function addUser(username, password_hash, callback) {
    const db = new sqlite3.Database(dbPath);
    db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, password_hash], function(err) {
        db.close();
        callback(err, this ? this.lastID : null);
    });
}

module.exports = { findUserByUsername, addUser }; 