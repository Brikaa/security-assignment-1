module.exports = (req, res, next) => {
    if (
        !req.local.user ||
        (!req.local.user.is_challenge_author && !req.local.user.is_superuser)
    ) {
        return res.redirect('/');
    }

    return next();
};
