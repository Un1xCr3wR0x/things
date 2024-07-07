import { CertificateDcComponent } from './certificate-dc/certificate-dc.component';
import { CertificateIneligibilityScComponent } from './certificate-ineligibility-sc/certificate-ineligibility-sc.component';
import { GosiCertificateScComponent } from './gosi-certificate-sc/gosi-certificate-sc.component';
import { ViewCertificatesScComponent } from './view-certificates-sc/view-certificates-sc.component';
import { ZakatCertificateScComponent } from './zakat-certificate-sc/zakat-certificate-sc.component';

export const CERTIFICATE_COMPONENTS = [
  ViewCertificatesScComponent,
  CertificateDcComponent,
  GosiCertificateScComponent,
  ZakatCertificateScComponent,
  CertificateIneligibilityScComponent
];

export * from './certificate-dc/certificate-dc.component';
export * from './gosi-certificate-sc/gosi-certificate-sc.component';
export * from './view-certificates-sc/view-certificates-sc.component';
export * from './zakat-certificate-sc/zakat-certificate-sc.component';
