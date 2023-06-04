import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixbusMonitorComponent } from './mixbus-monitor.component';

describe('MixbusMonitorComponent', () => {
  let component: MixbusMonitorComponent;
  let fixture: ComponentFixture<MixbusMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MixbusMonitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixbusMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
