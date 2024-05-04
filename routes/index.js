const { Router } = require('express');
const router = Router();

const ticketController = require('../controllers/ticketController');

module.exports = (app) => {
    // Rutas para los tickets de parqueo
    router.get('/tickets', ticketController.getAllTickets);
    router.get('/tickets/:id', ticketController.getTicketById);
    router.post('/tickets', ticketController.createTicket);
    router.put('/tickets/placa', ticketController.updateTicket);
    router.delete('/tickets/:id', ticketController.deleteTicket);

    // Otras rutas existentes
    // ...

    app.use('/', router);
};