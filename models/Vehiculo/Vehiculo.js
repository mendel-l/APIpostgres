'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Vehiculo extends Model {
    static associate(models) {
      // Asociaciones con otros modelos
      Vehiculo.hasMany(models.Ticket, { foreignKey: 'id_vehiculo' });
    }
  }
  Vehiculo.init({
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    placa: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Vehiculo',
    tableName: 'vehiculos',
    timestamps: false
  });
  return Vehiculo;
};