import { Publisher, OrderCreatedEvent, Subjects } from '@jpa-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
