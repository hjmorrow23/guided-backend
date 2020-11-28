'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Location)
      User.belongsToMany(models.Location, { through: models.LocationUser });
      User.belongsToMany(models.Tour, { through: models.TourUser });    
    }
  };
  User.init({
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: { 
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};