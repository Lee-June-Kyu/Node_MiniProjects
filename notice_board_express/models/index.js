const Sequelize = require('sequelize');
const User = require('./user');
const Message = require('./message');
const Session = require('./session');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;
db.Session = Session;
db.Message = Message;

User.init(sequelize);
Session.init(sequelize);
Message.init(sequelize);

User.associate(db);
Session.associate(db);
Message.associate(db);

module.exports = db;
