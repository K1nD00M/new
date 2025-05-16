PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Категории_Услуг (
    id_категория INTEGER PRIMARY KEY AUTOINCREMENT,
    название TEXT NOT NULL,
    описание TEXT
);

CREATE TABLE IF NOT EXISTS типы_номеров (
    id_тип_номера INTEGER PRIMARY KEY AUTOINCREMENT,
    название_типа TEXT NOT NULL,
    описание TEXT,
    базовая_цена REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS Номера (
    id_номер INTEGER PRIMARY KEY AUTOINCREMENT,
    номер_комнаты TEXT NOT NULL,
    id_тип_номера INTEGER NOT NULL,
    цена_за_ночь REAL NOT NULL,
    вместимость INTEGER NOT NULL,
    статус TEXT,
    отзыв TEXT,
    FOREIGN KEY (id_тип_номера) REFERENCES типы_номеров(id_тип_номера) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Гости (
    id_гость INTEGER PRIMARY KEY AUTOINCREMENT,
    ФИО TEXT NOT NULL,
    телефон TEXT,
    почта TEXT,
    паспорт TEXT,
    дата_регистрации TEXT,
    дата_въезда TEXT,
    статус_гостя TEXT,
    баллы INTEGER
);

CREATE TABLE IF NOT EXISTS Программа_Лояльности (
    id_программа_лояльности INTEGER PRIMARY KEY AUTOINCREMENT,
    название_уровня TEXT,
    процент_скидки REAL,
    требуемые_баллы INTEGER,
    преимущества TEXT,
    id_гость INTEGER NOT NULL,
    FOREIGN KEY (id_гость) REFERENCES Гости(id_гость) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS статус_брони (
    id_статус_брони INTEGER PRIMARY KEY AUTOINCREMENT,
    забронировано TEXT,
    оплачено TEXT,
    на_уборке TEXT
);

CREATE TABLE IF NOT EXISTS бронирование (
    id_бронь INTEGER PRIMARY KEY AUTOINCREMENT,
    id_номер INTEGER NOT NULL,
    id_гость INTEGER NOT NULL,
    дата_заезда TEXT,
    дата_выезда TEXT,
    id_статус_брони INTEGER NOT NULL,
    общая_стоимость REAL,
    скидка REAL,
    колво_гостей INTEGER,
    FOREIGN KEY (id_номер) REFERENCES Номера(id_номер) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_гость) REFERENCES Гости(id_гость) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_статус_брони) REFERENCES статус_брони(id_статус_брони) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS услуги (
    id_услуга INTEGER PRIMARY KEY AUTOINCREMENT,
    название TEXT NOT NULL,
    описание TEXT,
    цена REAL NOT NULL,
    id_категория INTEGER NOT NULL,
    FOREIGN KEY (id_категория) REFERENCES Категории_Услуг(id_категория) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Заказы_услуг (
    id_заказ INTEGER PRIMARY KEY AUTOINCREMENT,
    id_бронь INTEGER NOT NULL,
    id_услуга INTEGER NOT NULL,
    дата_заказа TEXT,
    сумма REAL,
    статус TEXT,
    FOREIGN KEY (id_бронь) REFERENCES бронирование(id_бронь) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_услуга) REFERENCES услуги(id_услуга) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS отзывы (
    id_отзыва INTEGER PRIMARY KEY AUTOINCREMENT,
    ФИО_гостя TEXT,
    оценка INTEGER,
    комментарий TEXT,
    дата_отзыва TEXT,
    ответ TEXT,
    дата_ответа TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
); 