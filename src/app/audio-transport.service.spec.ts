import { TestBed } from '@angular/core/testing';

import { AudioTransportService } from './audio-transport.service';

describe('AudioTransportService', () => {
  let service: AudioTransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioTransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
