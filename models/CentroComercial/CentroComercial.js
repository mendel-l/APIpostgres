'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CentroComercial extends Model {
    static associate(models) {
      // Asociaciones con otros modelos
      CentroComercial.hasMany(models.Ticket, { foreignKey: 'id_centro' });
    }
  }
  CentroComercial.init({
    id_centro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'CentroComercial',
    tableName: 'centros_comerciales',
    timestamps: false
  });
  return CentroComercial;
};