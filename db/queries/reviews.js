const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '..', 'hotel.db');

function readSQL(filename) {
    return fs.readFileSync(path.join(__dirname, 'reviews', filename), 'utf-8');
}

function getAllReviews(callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_all.sql');
    db.all(sql, [], (err, rows) => {
        db.close();
        callback(err, rows);
    });
}

function getReviewById(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('select_by_id.sql');
    db.get(sql, [id], (err, row) => {
        db.close();
        callback(err, row);
    });
}

function addReview(review, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('insert.sql');
    const params = [review.ФИО_гостя, review.оценка, review.комментарий, review.дата_отзыва, review.ответ, review.дата_ответа];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.lastID : null);
    });
}

function updateReview(id, review, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('update.sql');
    const params = [review.ФИО_гостя, review.оценка, review.комментарий, review.дата_отзыва, review.ответ, review.дата_ответа, id];
    db.run(sql, params, function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

function deleteReview(id, callback) {
    const db = new sqlite3.Database(dbPath);
    const sql = readSQL('delete.sql');
    db.run(sql, [id], function(err) {
        db.close();
        callback(err, this ? this.changes : null);
    });
}

module.exports = {
    getAllReviews,
    getReviewById,
    addReview,
    updateReview,
    deleteReview
}; 