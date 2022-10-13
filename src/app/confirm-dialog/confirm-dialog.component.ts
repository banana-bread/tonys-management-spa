import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from './confirm-dialog-data.interface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit {

  title: string = this.data?.title || 'Confirm';
  message: string = this.data?.message || 'Are you sure you want to continue?';
  okLabel: string = this.data?.okLabel || 'Ok';
  okColor: string = this.data?.okColor || 'accent';
  cancelLabel: string = this.data?.cancelLabel || 'Cancel'; 

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) { }

  ngOnInit(): void {}
}
