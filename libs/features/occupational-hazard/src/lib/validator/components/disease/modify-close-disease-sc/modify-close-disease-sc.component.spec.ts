import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCloseDiseaseScComponent } from './modify-close-disease-sc.component';

describe('ModifyCloseDiseaseScComponent', () => {
  let component: ModifyCloseDiseaseScComponent;
  let fixture: ComponentFixture<ModifyCloseDiseaseScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyCloseDiseaseScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCloseDiseaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
