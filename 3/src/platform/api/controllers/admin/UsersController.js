module.exports = {
    async view_all(req, res) {
        let users = await db.users.find_all({
            attributes: [
                'user_id',
                'username',
                'display_name',
                'is_superuser',
                'is_contest_author',
                'is_challenge_author',
                'created_at'
            ],
            where: {
                [$not]: {
                    user_id: req.session.user_id
                }
            },
            order: [['user_id', 'desc']]
        });

        return res.view({
            users
        });
    },

    async login_as(req, res) {
        let target_id = parse_int(req.query.user_id);

        let user = await db.users.find_one({
            where: {
                user_id: target_id
            }
        });

        // The logging in logic
        if (req.session.user_id === target_id || req.session.old_id || !user) {
            // On trying to log in as oneself or not using the original user
            return res.view('home/fourohfour');
        }

        req.session.old_id = req.session.user_id;
        req.session.user_id = target_id;

        return res.redirect('/');
    },

    async update_user_info(req, res) {
        try {
            if (req.params.user_id === undefined) {
                return res.status(400).send({ message: 'Missing user id' });
            }
            const allowed_fields = ['is_contest_author', 'is_challenge_author', 'is_superuser'];
            let found = false;
            const update_body = {};
            for (const field of allowed_fields) {
                if (field in req.body) {
                    found = true;
                    if (
                        (field === 'is_contest_author' ||
                            field === 'is_challenge_author' ||
                            field === 'is_superuser') &&
                        req.body[field] != 0 &&
                        req.body[field] != 1
                    ) {
                        return res.status(400).send({ message: 'Invalid value' });
                    }
                    update_body[field] = req.body[field];
                }
            }
            if (!found) {
                return res.status(400).send({ message: 'Nothing to update' });
            }
            await db.users.update(update_body, {
                where: { user_id: req.params.user_id }
            });
            return res.status(200).send();
        } catch (e) {
            console.error(e);
            return res.status(500).send();
        }
    }
};
