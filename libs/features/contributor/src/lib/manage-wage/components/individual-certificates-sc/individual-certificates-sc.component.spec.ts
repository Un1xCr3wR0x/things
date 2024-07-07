import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCertificatesScComponent } from './individual-certificates-sc.component';

describe('IndividualCertificatesScComponent', () => {
  let component: IndividualCertificatesScComponent;
  let fixture: ComponentFixture<IndividualCertificatesScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualCertificatesScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCertificatesScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
