import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInvitationDialogComponent } from './staff-invitation-dialog.component';

describe('StaffInvitationDialogComponent', () => {
  let component: StaffInvitationDialogComponent;
  let fixture: ComponentFixture<StaffInvitationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffInvitationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffInvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
