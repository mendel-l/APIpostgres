'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RegistroDePago extends Model {
    static associate(models) {
      // Asociaciones con otros modelos
      RegistroDePago.belongsTo(models.Ticket, { foreignKey: 'id_ticket' });
    }
  }
  RegistroDePago.init({
    id_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_ticket: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    monto_pagado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RegistroDePago',
    tableName: 'registro_de_pagos',
    timestamps: false
  });
  return RegistroDePago;
};