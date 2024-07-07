/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/** The index file is used to export the components inside this folder. */
import { AlertService } from './alert.service';
import { AuthTokenService } from './auth-token.service';
import { CalendarService } from './calendar.service';
import { CaptchaService } from './captcha.service';
import { CoreAdjustmentService } from './core-adjustment.service';
import { CoreBenefitService } from './core-benefit.service';
import { CoreContributorService } from './core-contributor.service';
import { CryptoService } from './crypto.service';
import { DocumentService } from './document.service';
import { ExchangeRateService } from './exchange-rate.service';
import { IdentityManagementService } from './identity-management.service';
import { InspectionService } from './inspection.service';
import { LoginService } from './login.service';
import { LookupService } from './lookup.service';
import { MenuService } from './menu.service';
import { NotificationService } from './notification.service';
import { OTPService } from './otp.service';
import { PushMessageService } from './push-message.service';
import { RouterService } from './router.service';
import { SearchService } from './search.service';
import { SendSMSNotificationService } from './send-sms-notification.service';
import { VerifyNiNumberService } from './verify-ninumber.service';
import { SseApiService } from './sse-api.service';
import { StorageService } from './storage.service';
import { SystemService } from './system.service';
import { ToastrMessageService } from './toastr-message.service';
import { TransactionService } from './transaction.service';
import { UuidGeneratorService } from './uuid-generator.service';
import { WorkflowService } from './workflow.service';
import { StartupService } from './startup.service';
import { CoreIndividualProfileService } from './core-individual-profile.service';
import {GlobalSearchService} from './global-search.service';
import { MedicalAssessmentService } from './medical-assessment.service';
import { MedicalboardAssessmentService } from './medical-board-services/medicalboard-assessment.service';
import { AddVisitingDoctorService } from './medical-board-services/add-visiting-doctor.service';
import { ContributorAssessmentService } from './medical-board-services/contributor-assessment.service';

export const CORE_PROVIDERS: Object[] = [
  CoreAdjustmentService,
  CoreBenefitService,
  LookupService,
  StorageService,
  PushMessageService,
  NotificationService,
  AuthTokenService,
  LoginService,
  DocumentService,
  WorkflowService,
  AlertService,
  MedicalAssessmentService,
  RouterService,
  CoreContributorService,
  ToastrMessageService,
  ExchangeRateService,
  SseApiService,
  UuidGeneratorService,
  TransactionService,
  MenuService,
  InspectionService,
  IdentityManagementService,
  OTPService,
  SearchService,
  CaptchaService,
  CalendarService,
  CryptoService,
  SendSMSNotificationService,
  VerifyNiNumberService,
  SystemService,
  StartupService,
  CoreIndividualProfileService,
  GlobalSearchService,
  CoreIndividualProfileService,
  MedicalboardAssessmentService,
  AddVisitingDoctorService,
  ContributorAssessmentService
];

export * from './alert.service';
export * from './auth-token.service';
export * from './calendar.service';
export * from './captcha.service';
export * from './core-contributor.service';
export * from './core-adjustment.service';
export * from './core-benefit.service';
export * from './core-individual-profile.service';
export * from './crypto.service';
export * from './medical-assessment.service';
export * from './document.service';
export * from './exchange-rate.service';
export * from './identity-management.service';
export * from './inspection.service';
export * from './login.service';
export * from './lookup.service';
export * from './menu.service';
export * from './notification.service';
export * from './otp.service';
export * from './push-message.service';
export * from './router.service';
export * from './search.service';
export * from './send-sms-notification.service';
export * from './verify-ninumber.service';
export * from './sse-api.service';
export * from './storage.service';
export * from './system.service';
export * from './toastr-message.service';
export * from './transaction.service';
export * from './uuid-generator.service';
export * from './workflow.service';
export * from './startup.service';
export * from './global-search.service';
export * from './medical-board-services/medicalboard-assessment.service';
export * from './medical-board-services/add-visiting-doctor.service';
export * from './medical-board-services/contributor-assessment.service';
