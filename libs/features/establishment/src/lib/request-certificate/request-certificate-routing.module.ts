import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { GosiCertificateScComponent, ViewCertificatesScComponent, ZakatCertificateScComponent } from './components';
import { CertificateIneligibilityScComponent } from './components/certificate-ineligibility-sc/certificate-ineligibility-sc.component';
import { RequestCertificateDcComponent } from './request-certificate-dc.component';

const routes: Routes = [
  {
    path: '',
    component: RequestCertificateDcComponent,
    children: [
      { path: ':registrationNo/view', component: ViewCertificatesScComponent }, //view all admin of the group when searched when accessed with admin id
      {
        path: ':registrationNo/zakat-certificate',
        component: ZakatCertificateScComponent,
        canDeactivate: [TransactionStateGuard]
      }, //for branch
      {
        path: ':registrationNo/main/zakat-certificate',
        component: ZakatCertificateScComponent,
        canDeactivate: [TransactionStateGuard]
      }, //for main
      {
        path: ':registrationNo/group/zakat-certificate',
        component: ZakatCertificateScComponent,
        canDeactivate: [TransactionStateGuard]
      }, // for group
      {
        path: ':registrationNo/gosi-certificate',
        component: GosiCertificateScComponent,
        canDeactivate: [TransactionStateGuard]
      },
      { path: ':registrationNo/not-eligible', component: CertificateIneligibilityScComponent },
      {
        path: ':registrationNo/oh-certificate',
        component: ZakatCertificateScComponent,
        canDeactivate: [TransactionStateGuard]
      } //for main
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RequestCertificateRoutingModule {}
