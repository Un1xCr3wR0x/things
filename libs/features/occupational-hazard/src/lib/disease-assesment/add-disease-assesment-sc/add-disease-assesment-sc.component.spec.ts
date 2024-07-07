import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiseaseAssesmentScComponent } from './add-disease-assesment-sc.component';

describe('AddDiseaseAssesmentScComponent', () => {
  let component: AddDiseaseAssesmentScComponent;
  let fixture: ComponentFixture<AddDiseaseAssesmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiseaseAssesmentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiseaseAssesmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
