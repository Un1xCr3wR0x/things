import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCertificatesDcComponent } from './individual-certificates-dc.component';

describe('IndividualCertificatesDcComponent', () => {
  let component: IndividualCertificatesDcComponent;
  let fixture: ComponentFixture<IndividualCertificatesDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualCertificatesDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCertificatesDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
