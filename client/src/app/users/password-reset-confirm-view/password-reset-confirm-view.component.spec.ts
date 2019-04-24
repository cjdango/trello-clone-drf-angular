import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetConfirmViewComponent } from './password-reset-confirm-view.component';

describe('PasswordResetConfirmViewComponent', () => {
  let component: PasswordResetConfirmViewComponent;
  let fixture: ComponentFixture<PasswordResetConfirmViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetConfirmViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetConfirmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
