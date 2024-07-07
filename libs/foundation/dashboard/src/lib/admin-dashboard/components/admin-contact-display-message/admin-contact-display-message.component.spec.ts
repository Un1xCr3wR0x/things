import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactDisplayMessageComponent } from './admin-contact-display-message.component';

describe('AdminContactDisplayMessageComponent', () => {
  let component: AdminContactDisplayMessageComponent;
  let fixture: ComponentFixture<AdminContactDisplayMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminContactDisplayMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContactDisplayMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
