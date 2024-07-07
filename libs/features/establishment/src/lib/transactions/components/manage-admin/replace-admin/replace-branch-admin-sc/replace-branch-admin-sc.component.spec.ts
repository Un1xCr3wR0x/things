import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceBranchAdminScComponent } from './replace-branch-admin-sc.component';

describe('ReplaceBranchAdminScComponent', () => {
  let component: ReplaceBranchAdminScComponent;
  let fixture: ComponentFixture<ReplaceBranchAdminScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplaceBranchAdminScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceBranchAdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
