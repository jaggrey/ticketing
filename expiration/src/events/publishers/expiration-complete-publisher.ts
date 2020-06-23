import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects
} from '@jpa-tickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
