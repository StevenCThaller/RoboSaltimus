const User = require('../models/user');

module.exports = {
    newCommand: (req,res) => {
        User.findOneAndUpdate({ _id: req.params.uid }, { $addToSet: { commands: req.body }}, { runValidators: true, new: true })
            .then(data => res.json(data))
            .catch(err => {
                console.log("error?");
                res.status(400).json(err)
            });
    }
}