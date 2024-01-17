import { TestBed } from '@angular/core/testing';

import { CalendarDataBrokerService } from './calendar-data-broker.service';

describe('DatabrokerService', () => {
  let service: CalendarDataBrokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarDataBrokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
