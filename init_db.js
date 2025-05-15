const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'hotel.db');
const sqlPath = path.join(__dirname, 'db', 'init.sql');

const schema = fs.readFileSync(sqlPath, 'utf-8');

const db = new sqlite3.Database(dbPath);

db.exec(schema, (err) => {
    if (err) {
        console.error('Ошибка при создании базы:', err.message);
    } else {
        console.log('База данных успешно инициализирована!');
    }
    db.close();
}); 