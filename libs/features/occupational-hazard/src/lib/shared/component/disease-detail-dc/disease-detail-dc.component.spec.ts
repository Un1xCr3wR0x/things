import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseDetailDcComponent } from './disease-detail-dc.component';

describe('DiseaseDetailDcComponent', () => {
  let component: DiseaseDetailDcComponent;
  let fixture: ComponentFixture<DiseaseDetailDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseDetailDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseDetailDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
