import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanedListingScComponent } from '@gosi-ui/features/benefits/lib/saned/saned-listing/saned-listing-sc/saned-listing-sc.component';
import { IndividualWageScComponent } from '@gosi-ui/features/contributor/lib/manage-wage/components';
import { UnifiedEngagementScComponent } from '@gosi-ui/features/contributor/lib/manage-wage/components/unified-engagement/unified-engagement-sc/unified-engagement-sc.component';
import { InjuryHistoryScComponent } from '@gosi-ui/features/occupational-hazard/lib/injury/injury-history-sc/injury-history-sc.component';
import { TransactionHistoryScComponent } from '@gosi-ui/foundation/transaction-tracing/lib/components/transaction-history-sc/transaction-history-sc.component';
import {
  CustomerContactScComponent,
  CustomerSurveyComponent,
  EstablishmentListScComponent,
  IndividualCertificateScComponent,
  IndividualProfileScComponent,
  NotificationComponent,
  PensionReformComponent
} from './components';
import { CertificateDetailsScComponent } from './components/certificate-details-sc/certificate-details-sc.component';
import { CertificateDocumentDcComponent } from './components/certificate-document-dc/certificate-document-dc.component';
import { DocumentDetailsScComponent } from './components/document-details-sc/document-details-sc.component';
import { EngagementsDetailsScComponent } from './components/engagements-details-sc/engagements-details-sc.component';
import { FinancialDetailsScComponent } from './components/financial-details-sc/financial-details-sc.component';
import { DocumentViewScComponent } from './components/individual-documents/document-view-sc/document-view-sc.component';
import { PersonalDetailsScComponent } from './components/personal-details-sc/personal-details-sc.component';
import { ProfileOverviewScComponent } from './components/profile-overview-sc/profile-overview-sc.component';
import { ModifyNationalityScComponent } from '../modify-nationality/components/modify-nationality-sc.component';
import { DirectPaymentHistoryScComponent } from '@gosi-ui/features/benefits/lib/annuity/direct-payment-history-sc/direct-payment-history-sc.component';
import { MedicalBoardAssessmentsScComponent } from '@gosi-ui/features/medical-board/lib/medical-board-assessments/components/medical-board-assessments-sc/medical-board-assessments-sc.component';

const routes: Routes = [
  {
    path: '',
    component: IndividualProfileScComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        component: ProfileOverviewScComponent
      },
      {
        path: 'transaction-history',
        loadChildren: () => import('@gosi-ui/foundation/transaction-tracing').then(mod => mod.TransactionTracingModule),
        component: TransactionHistoryScComponent
      },
      {
        path: 'personal-details',
        component: PersonalDetailsScComponent
      },
      {
        path: 'financial-details',
        component: FinancialDetailsScComponent
      },
      {
        path: 'pension-reform',
        component: PensionReformComponent
      },
      {
        path: 'notification',
        component: NotificationComponent
      },
      {
        path: 'customer-contact',
        component: CustomerContactScComponent
      },

      {
        path: 'customer-survey',
        component: CustomerSurveyComponent
      },
      {
        path: 'engagements',
        component: EngagementsDetailsScComponent,
        children: [
          { path: '', component: UnifiedEngagementScComponent, pathMatch: 'full' },
          {
            path: 'establishment/:registrationNo',
            component: IndividualWageScComponent
          }
        ]
      },
      {
        path: 'occupational-hazards',
        loadChildren: () => import('@gosi-ui/features/occupational-hazard').then(mod => mod.OccupationalHazardModule),
        component: InjuryHistoryScComponent
      },
      {
        path: 'benefits',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        component: SanedListingScComponent
      },
      {
        path: 'medical-board',
        loadChildren: () => import('@gosi-ui/features/medical-board').then(mod => mod.MedicalBoardModule),
        component: MedicalBoardAssessmentsScComponent
      },
      {
        path: 'benefits-payment-history',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        component: DirectPaymentHistoryScComponent
      },
      {
        path: 'establishments',
        component: EstablishmentListScComponent
      },
      {
        path: 'records',
        component: CertificateDocumentDcComponent,
        children: [
          { path: '', redirectTo: 'documents', pathMatch: 'full' },
          {
            path: 'certificates',
            component: CertificateDetailsScComponent
          },
          {
            path: 'documents',
            component: DocumentViewScComponent
          }
        ]
      },
      {
        path: 'certificates',
        component: CertificateDetailsScComponent
      },
      {
        path: 'documents',
        component: DocumentViewScComponent
      },
      {
        path: 'certificate-details',
        component: CertificateDetailsScComponent
      },
      {
        path: 'individual-certificate',
        component: IndividualCertificateScComponent
      },
      {
        path: 'document-details',
        component: DocumentDetailsScComponent
      },
      { path: 'modify-nationality', component: ModifyNationalityScComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalIndividualRoutingModule {}
