import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarNotificationService } from '@tonys/shared';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { Employee } from 'src/app/models/employee/employee.model';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-staff-editor',
  templateUrl: './staff-editor.component.html',
  styleUrls: ['./staff-editor.component.scss']
})
export class StaffEditorComponent implements OnInit {

  loading = false;
  saving = false;

  original = new Employee();
  employee = new Employee();
  employeeId: string = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: AppStateService,
    private notifications: SnackbarNotificationService,
    private confirmDialog: ConfirmDialogService,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    if (this.employeeId === 'new') return;



  }

  onClose(){}
  onSave(){}
  onDelete(){}

}
