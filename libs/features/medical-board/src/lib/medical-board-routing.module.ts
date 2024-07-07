/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalBoardDcComponent } from './medical-board-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: MedicalBoardDcComponent,
    children: [
      {
        path: 'list-members',
        loadChildren: () =>
          import('./view-board-members/view-board-member.module').then(mod => mod.ViewBoardMemberModule),
        data: {
          breadcrumb: 'MEDICAL-BOARD.MEDICAL-BOARD-MEMBERS'
        }
      },
      {
        path: 'add-members',
        loadChildren: () => import('./add-member/add-member.module').then(mod => mod.AddMemberModule),
        data: {
          breadcrumb: 'MEDICAL-BOARD.MEDICAL-BOARD-MEMBERS'
        }
      },
      {
        path: 'doctor-profile',
        loadChildren: () => import('./doctor-profile/doctor-profile.module').then(mod => mod.DoctorProfileModule)
      },
      {
        path: 'doctor-profile/:identificationNo',
        loadChildren: () => import('./doctor-profile/doctor-profile.module').then(mod => mod.DoctorProfileModule)
      },
      {
        path: 'participant-profile/:identificationNo',
        loadChildren: () => import('./participant-profile/participant-profile.module').then(mod => mod.ParticipantProfileModule)
      },
      {
        path: 'validator',
        loadChildren: () => import('./validator/validator.module').then(mod => mod.ValidatorModule)
      },
      {
        path: 'medical-board-session',
        loadChildren: () =>
          import('./medical-board-session/medical-board-session.module').then(mod => mod.MedicalBoardSessionModule)
      },
      {
        path: 'medical-board-session-status',
        loadChildren: () => import('./session-status/session-status.module').then(mod => mod.SessionStatusModule)
      },
      {
        path: 'medical-board-participant-queue',
        loadChildren: () =>
          import('./participant-queue/participant-queue.module').then(mod => mod.ParticipantQueueModule)
      },

      {
        path: 'transactions',
        loadChildren: () =>
          import('./transactions/transactions.module').then(mod => mod.TransactionsModule)
      },
      {
        path: 'add-visiting-doctor',
        loadChildren: () =>
          import('./add-visiting-doctor/add-visiting-doctor.module').then(mod => mod.AddVisitingDoctorModule)
      },
      {
        path: 'disability-assessment',
        loadChildren: () =>
          import('./disability-assessment/disability-assessment.module').then(mod => mod.DisabilityAssessmentModule)
      } ,
      {
        path: 'medical-board-assessments',
        loadChildren: () =>
          import('./medical-board-assessments/medical-board-assessments.module').then(mod => mod.MedicalBoardAssessmentsModule)
      },
      {
        path:'payment-history',
        loadChildren: () => import('./payment-history/payment-history.module').then(mod => mod.PaymentHistoryModule)
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalBoardMembersRoutingModule { }
