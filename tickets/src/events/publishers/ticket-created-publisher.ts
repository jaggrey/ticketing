import { Publisher, Subjects, TicketCreatedEvent } from '@jpa-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
