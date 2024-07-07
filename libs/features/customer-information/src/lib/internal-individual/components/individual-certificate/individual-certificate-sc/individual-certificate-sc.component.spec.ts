import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCertificateScComponent } from './individual-certificate-sc.component';

describe('CertificateDetailsScComponent', () => {
  let component: IndividualCertificateScComponent;
  let fixture: ComponentFixture<IndividualCertificateScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualCertificateScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCertificateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
