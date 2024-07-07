/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { DoctorProfileRoutingModule } from './doctor-profile-routing.module';
import { DoctorProfileDcComponent } from './doctor-profile-dc.component';
import { DOCTOR_PROFILE_COMPONENTS } from './components';
import { MedicalBoardSessionInvitationDcComponent } from './components/medical-board-session-invitation-dc/medical-board-session-invitation-dc.component';
import { BankDetailsDoctorDcComponent } from './components/bank-details-doctor-dc/bank-details-doctor-dc.component';
import { ContactDetailsDoctorDcComponent } from './components/contact-details-doctor-dc/contact-details-doctor-dc.component';
import { AddressDetailsDoctorDcComponent } from './components/address-details-doctor-dc/address-details-doctor-dc.component';
import { MemberDetailsContractDcComponent } from './components/member-details-contract-dc/member-details-contract-dc.component';
import { UnavailablePeriodContractDcComponent } from './components/unavailable-period-contract-dc/unavailable-period-contract-dc.component';
import { PeriodToArabicPipe } from '../shared/pipes/period-arabic';
import { SessionInvitationFilterDcComponent } from './components/session-invitation-filter-dc/session-invitation-filter-dc.component';
import { ContactOtpDcComponent } from './components/contact-otp-dc/contact-otp-dc.component';
//TODO Use barrel file to import components
@NgModule({
  declarations: [
    DoctorProfileDcComponent,
    ...DOCTOR_PROFILE_COMPONENTS,
    MedicalBoardSessionInvitationDcComponent,
    BankDetailsDoctorDcComponent,
    ContactDetailsDoctorDcComponent,
    AddressDetailsDoctorDcComponent,
    MemberDetailsContractDcComponent,
    UnavailablePeriodContractDcComponent,
    PeriodToArabicPipe,
    SessionInvitationFilterDcComponent,
    ContactOtpDcComponent
  ],
  imports: [CommonModule, ValidatorModule, FormFragmentsModule, SharedModule, DoctorProfileRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorProfileModule {}
