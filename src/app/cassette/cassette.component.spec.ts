import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CassetteComponent } from './cassette.component';

describe('CassetteComponent', () => {
  let component: CassetteComponent;
  let fixture: ComponentFixture<CassetteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CassetteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CassetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
