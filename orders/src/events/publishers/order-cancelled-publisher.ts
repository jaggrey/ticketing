import { Subjects, Publisher, OrderCancelledEvent } from '@jpa-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
