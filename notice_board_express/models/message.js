const Sequelize = require('sequelize');

module.exports = class Message extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Message',
      tableName: 'messages',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Message.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
  }
};
