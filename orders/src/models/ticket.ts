import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isResevered(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

// Change __v to version
ticketSchema.set('versionKey', 'version');

// Handle Optimistic Concurrency Control - update version on ticket save
ticketSchema.plugin(updateIfCurrentPlugin);

// statics allow us to add a method to the Ticket model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};

//methods allow us to add a method to the Ticket document, make sure not to use an arrow funciton
ticketSchema.methods.isResevered = async function () {
  // - Run query to look at all orders. Find the order where the ticket is the ticket we
  // - just fetched from the db *and* the order status in *not* cancelled
  // - If we find an order from this that means the ticket is reserved

  const existingOrder = await Order.findOne({
    ticket: this, // this === the ticket document that we just called 'isReserved' on
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder; // if existingOrder === null, the first exclamation changes it to true, then second changes it to false
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
