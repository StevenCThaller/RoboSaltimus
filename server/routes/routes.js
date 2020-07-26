module.exports = app => {
    app.use('/api/users', require('./user.routes'));
    app.use('/api/commands', require('./command.routes'));
}