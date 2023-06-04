import { TestBed } from '@angular/core/testing';

import { AudioVisualizerService } from './audio-visualizer.service';

describe('AudioVisualizerService', () => {
  let service: AudioVisualizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioVisualizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
