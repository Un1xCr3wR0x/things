import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRpaTranscationScComponent } from './cancel-rpa-transcation-sc.component';

describe('CancelRpaTranscationScComponent', () => {
  let component: CancelRpaTranscationScComponent;
  let fixture: ComponentFixture<CancelRpaTranscationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelRpaTranscationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelRpaTranscationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
