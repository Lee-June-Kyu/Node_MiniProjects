const Sequelize = require('sequelize');

module.exports = class Session extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Session',
      tableName: 'sessions',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Session.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
  }
};
