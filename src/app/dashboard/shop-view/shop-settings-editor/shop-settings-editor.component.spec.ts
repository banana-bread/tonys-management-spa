import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSettingsEditorComponent } from './shop-settings-editor.component';

describe('ShopSettingsEditorComponent', () => {
  let component: ShopSettingsEditorComponent;
  let fixture: ComponentFixture<ShopSettingsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopSettingsEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSettingsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
