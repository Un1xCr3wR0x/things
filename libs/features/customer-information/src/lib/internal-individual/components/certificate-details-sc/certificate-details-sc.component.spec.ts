import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDetailsScComponent } from './certificate-details-sc.component';

describe('CertificateDetailsScComponent', () => {
  let component: CertificateDetailsScComponent;
  let fixture: ComponentFixture<CertificateDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
