PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS service_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS room_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    base_price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL,
    room_type_id INTEGER NOT NULL,
    price_per_night REAL NOT NULL,
    capacity INTEGER NOT NULL,
    status TEXT,
    review TEXT,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    passport TEXT,
    registration_date TEXT,
    check_in_date TEXT,
    guest_status TEXT,
    loyalty_points INTEGER
);

CREATE TABLE IF NOT EXISTS loyalty_program (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level_name TEXT,
    discount_percent REAL,
    required_points INTEGER,
    benefits TEXT,
    guest_id INTEGER NOT NULL,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_booked TEXT,
    is_paid TEXT,
    is_cleaning TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    guest_id INTEGER NOT NULL,
    check_in_date TEXT,
    check_out_date TEXT,
    status_id INTEGER NOT NULL,
    total_cost REAL,
    discount REAL,
    guest_count INTEGER,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (status_id) REFERENCES booking_status(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS service_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    order_date TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_name TEXT,
    rating INTEGER,
    comment TEXT,
    review_date TEXT,
    response TEXT,
    response_date TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
); 