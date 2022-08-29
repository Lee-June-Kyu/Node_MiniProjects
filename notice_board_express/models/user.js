const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: Sequelize.STRING(40),  //varchar
        unique: true,
        allowNull: false,           //not null
      },
      name: {
        type: Sequelize.STRING(20),  //varchar
        allowNull: false,           //not null
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Message, { foreignKey: 'userId', sourceKey: 'id' })
    ,db.User.hasOne(db.Session, { foreignKey: 'userId', sourceKey: 'id' });
  }
};
