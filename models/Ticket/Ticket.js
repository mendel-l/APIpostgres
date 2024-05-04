'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Ticket extends Model {
    static associate(models) {
      // Asociaciones con otros modelos
      Ticket.belongsTo(models.CentroComercial, { foreignKey: 'id_centro' });
      Ticket.belongsTo(models.Vehiculo, { foreignKey: 'id_vehiculo' });
      Ticket.hasMany(models.RegistroDePago, { foreignKey: 'id_ticket' });
    }
  }
  Ticket.init({
    id_ticket: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_centro: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hora_entrada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    hora_salida: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'pendiente'
    }
  }, {
    sequelize,
    modelName: 'Ticket',
    tableName: 'ticket',
    timestamps: false
  });
  return Ticket;
};