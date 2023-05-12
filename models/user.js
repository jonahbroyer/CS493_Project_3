const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const bcrypt = require('bcryptjs');

const User = sequelize.define('user', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  password: { 
    type: DataTypes.STRING,
    allowNull: false,
    async set(value) {
      const passwordHash = await bcrypt.hash(User.password, 8);
      this.setDataValue('password', hash(value));
    }
  }
});

exports.User = User
exports.UserClientFields = [
  'userId',
  'name',
  'email',
  'password',
  'admin',
  'businessId'
]
