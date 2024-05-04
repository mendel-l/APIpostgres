'use strict';
const db = require('../models');
const Ticket = db.Ticket;
const CentroComercial = db.CentroComercial;
const Vehiculo = db.Vehiculo;
const RegistroDePago = db.RegistroDePago;

const axios = require('axios');

function calcularTotal(horaEntrada, horaSalida) {
    const horasDiferencia = Math.ceil((horaSalida - horaEntrada) / (1000 * 60 * 60));
    const tarifaPorHora = 5;
    const totalAPagar = Math.max(horasDiferencia * tarifaPorHora, 0);
    return totalAPagar;
}

module.exports = {
    // GET ALL
    async getAllTickets(req, res) {
        try {
            const tickets = await Ticket.findAll({
                include: [CentroComercial, Vehiculo]
            });
            res.status(200).json(tickets);
        } catch (error) {
            console.error('Error al obtener los tickets:', error);
            res.status(500).json({ error: 'Error al obtener los tickets' });
        }
    },

    // GET ID
    async getTicketById(req, res) {
        const id = req.params.id;
        try {
            const ticket = await Ticket.findByPk(id, {
                include: [CentroComercial, Vehiculo, RegistroDePago]
            });
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket no encontrado' });
            }
            res.status(200).json(ticket);
        } catch (error) {
            console.error('Error al obtener el ticket por ID:', error);
            res.status(500).json({ error: 'Error al obtener el ticket por ID' });
        }
    },

    // POST - Crear un nuevo ticket de parqueo
    async createTicket(req, res) {
        try {
            const { nombreCentroComercial, placaVehiculo } = req.body;
            const centroComercial = await CentroComercial.findOne({ where: { nombre: nombreCentroComercial } });
    
            if (!centroComercial) {
                return res.status(404).json({ message: 'Centro comercial no encontrado' });
            }
            const vehiculoExistente = await Vehiculo.findOne({ where: { placa: placaVehiculo } });
    
            if (vehiculoExistente) {
                return res.status(400).json({ message: 'Ya existe un vehículo con esta placa' });
            }
    
            const vehiculo = await Vehiculo.create({ placa: placaVehiculo });
    
            const nuevoTicket = await Ticket.create({
                id_centro: centroComercial.id_centro,
                id_vehiculo: vehiculo.id_vehiculo,
                hora_entrada: new Date(),
                estado: 'pendiente'
            });
    
            res.status(201).json(nuevoTicket);
        } catch (error) {
            console.error('Error al crear un nuevo ticket:', error);
            res.status(500).json({ error: 'Error al crear un nuevo ticket' });
        }
    },

    // PUT - Actualizar un ticket de parqueo (registrar salida y pago)
    async updateTicket(req, res) {
        try {
            const placaVehiculo = req.body.placaVehiculo;
            const vehiculo = await Vehiculo.findOne({ where: { placa: placaVehiculo } });

            if (!vehiculo) {
                return res.status(404).json({ message: 'Vehículo no encontrado' });
            }

            const ticket = await Ticket.findOne({
                where: { id_vehiculo: vehiculo.id_vehiculo },
                include: [CentroComercial, Vehiculo]
            });

            if (!ticket) {
                return res.status(404).json({ message: 'Ticket no encontrado para este vehículo' });
            }

            if (ticket.estado === 'pagado') {
                ticket.estado = 'pendiente';
                ticket.hora_entrada = new Date();
                ticket.hora_salida = null;
                ticket.total = null;
                await ticket.save();

                res.status(200).json(ticket);
            } else {
                const horaSalida = new Date();
                const total = calcularTotal(ticket.hora_entrada, horaSalida);

                ticket.hora_salida = horaSalida;
                ticket.total = total;
                ticket.estado = 'pagado';

                await ticket.save();

                // Envío de datos a MongoDB
                try {
                    const response = await axios.post('http://localhost:5000/pagos', {
                        montoPagado: total,
                        fechaPago: new Date(ticket.hora_salida).toISOString().split('T')[0],
                        correlativo: `${ticket.id_ticket}`
                    });

                    if (response.status !== 201) {
                        throw new Error('Error al registrar el pago en MongoDB');
                    }
                } catch (error) {
                    console.error('Error al enviar datos a MongoDB:', error);
                    res.status(500).json({ error: 'Error al registrar el pago en MongoDB' });
                    return;
                }

                res.status(200).json(ticket);
            }
        } catch (error) {
            console.error('Error al actualizar el ticket:', error);
            res.status(500).json({ error: 'Error al actualizar el ticket' });
        }
    },

    // DELETE - Eliminar un ticket de parqueo
    async deleteTicket(req, res) {
        try {
            const ticketId = req.params.id;

            const ticket = await Ticket.findByPk(ticketId);

            if (!ticket) {
                return res.status(404).json({ message: 'Ticket no encontrado' });
            }

            await Ticket.destroy({ where: { id_ticket: ticketId } });

            res.status(200).json({ message: 'Ticket eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el ticket:', error);
            res.status(500).json({ error: 'Error al eliminar el ticket' });
        }
    }
};
