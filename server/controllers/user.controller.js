const User = require('../models/user');

module.exports = {
    register: (req,res) => {
        User.create(req.body)
            .then(data => {
                const { password, ...rest } = data._doc;
                res.json(rest)
            })
            .catch(err => res.status(400).json(err));
    },
}