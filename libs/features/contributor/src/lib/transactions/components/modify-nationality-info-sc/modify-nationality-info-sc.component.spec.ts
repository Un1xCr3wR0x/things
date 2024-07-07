import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyNationalityInfoScComponent } from './modify-nationality-info-sc.component';

describe('ModifyNationalityInfoScComponent', () => {
  let component: ModifyNationalityInfoScComponent;
  let fixture: ComponentFixture<ModifyNationalityInfoScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyNationalityInfoScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyNationalityInfoScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
