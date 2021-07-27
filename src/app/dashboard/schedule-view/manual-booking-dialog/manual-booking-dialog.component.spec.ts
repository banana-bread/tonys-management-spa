import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualBookingDialogComponent } from './manual-booking-dialog.component';

describe('ManualBookingDialogComponent', () => {
  let component: ManualBookingDialogComponent;
  let fixture: ComponentFixture<ManualBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualBookingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
