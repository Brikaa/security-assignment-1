module.exports = (req, res, next) => {
    if (
        !req.local.user ||
        (!req.local.user.is_contest_author && !req.local.user.is_superuser)
    ) {
        return res.redirect('/');
    }

    return next();
};
