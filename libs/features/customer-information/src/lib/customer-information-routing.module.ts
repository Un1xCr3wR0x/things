/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerInformationDcComponent } from './customer-information-dc.component';
import { ModifyPersonalDetailsScComponent } from './internal-individual/components/modify-personal-details-sc/modify-personal-details-sc.component';
import { AddBankDetailsScComponent } from './internal-individual/components/add-bank-sc/add-bank-details-sc.component';
import { UploadDocumentScComponent } from './internal-individual/components/individual-documents/upload-document-sc/upload-document-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: CustomerInformationDcComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => import('./person-profile/person-profile.module').then(mod => mod.PersonProfileModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.MY-PROFILE'
        }
      }, // normal user profile  - deprioritise
      {
        path: 'contributor',
        loadChildren: () => import('./person-profile/person-profile.module').then(mod => mod.PersonProfileModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      },
      {
        path: 'individual/internal/:personId',
        loadChildren: () =>
          import('./internal-individual/internal-individual.module').then(mod => mod.InternalIndividualModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      }, // contributor profile  - not to be used  - use regno and sin route
      {
        path: 'contributor/:sin/benefits/saned/list',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      },
      {
        path: 'contributor/:sin',
        loadChildren: () => import('./person-profile/person-profile.module').then(mod => mod.PersonProfileModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      }, // vic ntributor profile
      {
        path: 'contributor/:registrationNo/:sin',
        loadChildren: () => import('./person-profile/person-profile.module').then(mod => mod.PersonProfileModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      }, // contributor profile
      {
        path: 'validator',
        loadChildren: () => import('./validator/validator.module').then(mod => mod.ValidatorModule)
      }, // all validator transactions
      {
        path: 'user-activity',
        loadChildren: () => import('./user-activity/user-activity.module').then(mod => mod.UserActivityModule)
      },
      {
        path: 'individual/internal/:personId',
        loadChildren: () =>
          import('./internal-individual/internal-individual.module').then(mod => mod.InternalIndividualModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      },
      {
        path: 'contributor/:sin',
        loadChildren: () => import('./person-profile/person-profile.module').then(mod => mod.PersonProfileModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      }, // vic ntributor profile
      {
        path: 'contributor/:registrationNo/:sin',
        loadChildren: () => import('./person-profile/person-profile.module').then(mod => mod.PersonProfileModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.CNT-PROFILE'
        }
      }, // contributor profile
      {
        path: 'profile',
        loadChildren: () =>
          import('./contributor-profile/contributor-profile.module').then(mod => mod.ContributorProfileModule)
      },
      {
        path: ':personId/edit-personal-details',
        component: ModifyPersonalDetailsScComponent,
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.MOD_PERSONAL_DTLS'
        }
      },
      {
        path: ':personId/add-bank',
        component: AddBankDetailsScComponent,
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.ADD-NEW-BANK-ACCOUNT'
        }
      },
      {
        path: ':personId/document-upload',
        component: UploadDocumentScComponent,
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.UPLOAD-DOCUMENT'
        }
      },
      {
        path: 'modify-nationality/:personId',
        loadChildren: () => import('./modify-nationality/modify-nationality.module').then(mod => mod.ModifyNationalityModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.MOD_PERSONAL_DTLS'
        }
      },
      {
        path: 'modify-nationality/:personId/:validatorId',
        loadChildren: () => import('./modify-nationality/modify-nationality.module').then(mod => mod.ModifyNationalityModule),
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.MOD_PERSONAL_DTLS'
        }
      }
      // {
      //   path: 'contributor-profile',
      //   loadChildren: () => import('./contributor-profile/contributor-profile.module').then(mod => mod.ContributorProfileModule)
      // },
      // {
      //   path: ':identifier/edit-personal-details',
      //   component: ModifyPersonalDetailsScComponent,
      //   data: {
      //     breadcrumb: 'CUSTOMER-INFORMATION.MOD_PERSONAL_DTLS'
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerInformationRoutingModule {}
