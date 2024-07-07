import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CERTIFICATE_COMPONENTS } from './components';
import { RequestCertificateDcComponent } from './request-certificate-dc.component';
import { RequestCertificateRoutingModule } from './request-certificate-routing.module';

@NgModule({
  declarations: [RequestCertificateDcComponent, CERTIFICATE_COMPONENTS],
  imports: [CommonModule, SharedModule, RequestCertificateRoutingModule]
})
export class RequestCertificateModule {}
