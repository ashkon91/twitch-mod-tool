const express = require('express')
const Sequelize = require('sequelize');
const sequelize = new Sequelize('null', 'null', 'null', {
	host: 'localhost',
	dialect: 'sqlite',
	operatorsAliases: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

  // SQLite only
  storage: 'message.sqlite'
});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('message.db');
const router = express.Router();

const Message = sequelize.define('message_log', {
	username: Sequelize.STRING,
	message: Sequelize.STRING,
	action: Sequelize.STRING,
	moderator: Sequelize.STRING,
	reason: Sequelize.STRING,
	channel: Sequelize.STRING
});

router.post('/log_action', (req, res, next) => {

	sequelize
	.authenticate()
	.then(() => {
		const data = req.body;
		const name = data.user;
		const message = data.message.msg;
		const action = data.action;
		const channel = data.message.channel;
		const reason = data.reason;
		const mod = data.mod;


		sequelize.sync().then( function(){
			Message.create({
				username: name,
				message: message,
				action: action,
				moderator: mod,
				reason: reason,
				channel: channel
			})
		})

	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});
	return res.status(200).json();
});

router.get('/messages', (req, res, next) => {
	const data = req.body
	const username = data.user;
	sequelize
	.authenticate()
	.then(() => {
		sequelize.sync().then( function(){
			Message.findAll({
				where: {
					username: 'varelllp'
				}
			}, (messages) => {
				console.log(messages);
				return res.status(200).json(messages);
			});
		})
		
	})
	.catch(err => {

		console.error('Unable to connect to the database:', err);
	});
	return res.status(200).json();
});

module.exports = router;

