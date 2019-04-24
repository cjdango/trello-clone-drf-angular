import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetViewComponent } from './password-reset-view.component';

describe('PasswordResetViewComponent', () => {
  let component: PasswordResetViewComponent;
  let fixture: ComponentFixture<PasswordResetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
