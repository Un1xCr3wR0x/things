import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdminScComponent } from './delete-admin-sc.component';

describe('DeleteAdminScComponent', () => {
  let component: DeleteAdminScComponent;
  let fixture: ComponentFixture<DeleteAdminScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAdminScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
