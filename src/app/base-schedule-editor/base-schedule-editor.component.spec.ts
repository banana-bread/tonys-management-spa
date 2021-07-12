import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseScheduleEditorComponent } from './base-schedule-editor.component';

describe('BaseScheduleEditorComponent', () => {
  let component: BaseScheduleEditorComponent;
  let fixture: ComponentFixture<BaseScheduleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseScheduleEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseScheduleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
