import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@jpa-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket
    const ticket = await Ticket.findById(data.ticket.id);

    // If ticket is not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Unset the orderId in the reserved ticket
    ticket.set({ orderId: undefined });

    // Save ticket
    await ticket.save();

    // Publish updated ticket event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    });

    // Send acknowledgement to Nats-Streaming-Server
    msg.ack();
  }
}
