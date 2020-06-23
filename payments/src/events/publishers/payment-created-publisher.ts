import { Publisher, PaymentCreatedEvent, Subjects } from '@jpa-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
