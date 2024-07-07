import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateGenerateScComponent } from './certificate-generate-sc.component';

describe('CertificateGenerateScComponent', () => {
  let component: CertificateGenerateScComponent;
  let fixture: ComponentFixture<CertificateGenerateScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateGenerateScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateGenerateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
