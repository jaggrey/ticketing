import { Publisher, Subjects, TicketUpdatedEvent } from '@jpa-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
