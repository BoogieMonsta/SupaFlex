import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapeRecorderButtonComponent } from './tape-recorder-button.component';

describe('TapeRecorderButtonComponent', () => {
  let component: TapeRecorderButtonComponent;
  let fixture: ComponentFixture<TapeRecorderButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TapeRecorderButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TapeRecorderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
