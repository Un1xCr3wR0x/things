import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiseaseComplicationScComponent } from './view-disease-complication-sc.component';

describe('ViewDiseaseComplicationScComponent', () => {
  let component: ViewDiseaseComplicationScComponent;
  let fixture: ComponentFixture<ViewDiseaseComplicationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDiseaseComplicationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiseaseComplicationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
