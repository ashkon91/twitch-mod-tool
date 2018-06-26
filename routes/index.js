module.exports = (app) => {
	app.use('/api/v1', require('./api'));
	app.use('/auth', require('./auth'));
};