import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EAdminScComponent } from './e-admin-sc.component';

describe('EAdminScComponent', () => {
  let component: EAdminScComponent;
  let fixture: ComponentFixture<EAdminScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EAdminScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EAdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
