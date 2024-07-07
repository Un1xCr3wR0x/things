import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyNationalityScComponent } from './modify-nationality-sc.component';

describe('ModifyNationalityScComponent', () => {
  let component: ModifyNationalityScComponent;
  let fixture: ComponentFixture<ModifyNationalityScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyNationalityScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyNationalityScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
