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
  },
  scopes: {
    withoutPassword: {
      attributes: { exclude: ['[password'] },
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

exports.getUserByID = async function (userID, includePassword) {
  const projection = includePassword ? {} : { password: 0};
}

exports.validateUser = async function (id, password) {
  const user = await getUserByID(id, true);
  const authenticated = user &&
    await bcrypt.compare(password, user.password);
  return authenticated;
}
