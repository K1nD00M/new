const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    // Сохраняем URL, на который пытался попасть пользователь
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
};

module.exports = {
    isAuthenticated
}; 