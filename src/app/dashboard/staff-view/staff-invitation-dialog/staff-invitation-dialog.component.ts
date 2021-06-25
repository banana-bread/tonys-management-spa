import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarNotificationService } from '@tonys/shared';
import { EmployeeService } from 'src/app/models/employee/employee.service';
import { AppStateService } from 'src/app/services/app-state.service';


@Component({
  selector: 'app-staff-invitation-dialog',
  templateUrl: './staff-invitation-dialog.component.html',
  styleUrls: ['./staff-invitation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StaffInvitationDialogComponent implements OnInit {

  @ViewChild('dialogForm') dialogForm: NgForm;
  // @ViewChildren('emailControl', { read: ElementRef }) emailControls: QueryList<ElementRef>;
  @ViewChildren('emailControl') emailControls: QueryList<ElementRef>;
  @ViewChildren('emailModel') emailModels: QueryList<NgModel>;

  emails = [
    {id: Date.now(), address: '',}
  ];

  sending = false;

  constructor(
    public dialogRef: MatDialogRef<StaffInvitationDialogComponent>,
    private employeeService: EmployeeService,
    private notifications: SnackbarNotificationService,
    ) { }

  ngOnInit(): void {
  }

  async onSend()
  {
    // TODO: check for invalid emails
    if (this.dialogForm.invalid) return;
    
    this.sending = true;

    const emails: string[] = this.emails
      .filter(email => !!email.address)
      .map(email => email.address);

    try
    {
      await this.employeeService.invite(emails);
      this.notifications.success('Invitations sent');
      this.dialogRef.close();
    }
    catch
    {
      this.notifications.error('Error sending invitations');
    }
    finally
    {
      this.sending = false;
    }
  }

  onAdd()
  {
    this.emails.push({id: Date.now(), address: '',})

    // TODO: for now we're leaving the email fields un-validated because of issues.
    // setTimeout(() => {
        // this.emailModels.last.control.setErrors(null);
        // this.emailControls.last.nativeElement.focus()
    // })
  }

  onRemove(index: number)
  {
    this.emails.splice(index, 1);
  }

}
