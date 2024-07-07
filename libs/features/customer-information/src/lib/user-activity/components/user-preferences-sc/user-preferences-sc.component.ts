/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BaseComponent,
  InternalUserNotificationPreference,
  LanguageToken,
  LovList,
  StorageService,
  UserPreference,
  UserPreferenceRequest,
  UserPreferenceResponse
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { UserActivityService } from '../../../shared';
const enum ApplicationLanguageEnum {
  EN = 'En',
  AR = 'Ar'
}
const enum NotificationLanguageEnum {
  ENGLISH_LANGUAGE = 'English',
  ARABIC_LANGUAGE = 'Arabic',
  ARABIC_NOTIFICATION = 'عربي',
  ENGLISH_NOTIFICATION = 'انجليزي'
}
const enum ContactPreferenceEnum {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  ALL = 'ALL'
}

const enum EventPreferenceEnum {
  ASSIGN = 'ASSIGN',
  REASSIGN = 'REASSIGN',
  REJECTION = 'REJECTION',
  RETURN = 'RETURN',
  REOPEN = 'REOPEN',
  QLA_BREACH = 'QLA_BREACH',
  REQUEST_INFO = 'REQUEST_INFORMATION',
  PROVIDE_INFO = 'PROVIDE_INFORMATION'
}

@Component({
  selector: 'cim-user-preferences-sc',
  templateUrl: './user-preferences-sc.component.html',
  styleUrls: ['./user-preferences-sc.component.scss']
})
export class UserPreferencesScComponent extends BaseComponent implements OnInit {
  /*
   * Local variables
   */
  adminDetails: UserPreference = new UserPreference();
  applicationLanguage: string;
  channelList = [
    {
      label: 'EMAIL-ID',
      control: 'email'
    },
    {
      label: 'SMS',
      control: 'sms'
    }
  ];

  eventList = [
    {
      label: 'ASSIGN',
      control: 'assign'
    },
    // {
    //   label: 'Reassign',
    //   control: 'reassign'
    // },
    // {
    //   label: 'Rejection',
    //   control: 'rejection'
    // },
    {
      label: 'REJECT',
      control: 'return'
    }
    // {
    //   label: 'Reopen',
    //   control: 'reopen'
    // },
    // {
    //   label: 'OLA Breach',
    //   control: 'oLA_Breach'
    // },
    // {
    //   label: 'Request Information',
    //   control: 'request_Information'
    // },
    // {
    //   label: 'Provide Information',
    //   control: 'provide_Information'
    // }
  ];
  commPreferences: string;
  contactPreferences: Array<string>;
  modalRef: BsModalRef;
  registrationNo: number;
  userPreferenceForm: FormGroup;
  userPreferenceLanguages: LovList = new LovList([]);
  userPreferenceResponse: UserPreferenceResponse;
  userPreferences: UserPreference = new UserPreference();
  disableContactPreference: boolean;
  disableApplicationLanguage: boolean;
  disableNotificationLanguage: boolean;
  invalid = true;
  personIdentifier: number;
  isPrivate: boolean;
  internalUserNotificationPreferences: InternalUserNotificationPreference;
  assignmentNotification: boolean;
  /**
   *
   * @param userPreferencesService
   * @param storageService
   * @param fb
   * @param alertService
   * @param language
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,

    readonly alertService: AlertService,
    readonly fb: FormBuilder,
    readonly storageService: StorageService,
    readonly userActivityService: UserActivityService,
    readonly modalService: BsModalService,
    readonly location: Location,
    readonly authService: AuthTokenService
  ) {
    super();
  }
  /*
   * This method is to initialise variables
   */
  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;

    this.alertService.clearAlerts();
    this.userPreferenceLanguages = new LovList([
      {
        value: {
          english: NotificationLanguageEnum.ARABIC_LANGUAGE,
          arabic: NotificationLanguageEnum.ARABIC_NOTIFICATION
        },
        sequence: 1
      },
      {
        value: {
          english: NotificationLanguageEnum.ENGLISH_LANGUAGE,
          arabic: NotificationLanguageEnum.ENGLISH_NOTIFICATION
        },
        sequence: 2
      }
    ]);
    this.userPreferenceForm = this.createUserPreferenceForm();
    if (!this.isPrivate) {
      this.getAdminDetails();
      this.getPreferredLanguage();
    } else {
      this.getInternalUserNotificationPreferences();
    }
  }
  /*
   * This method is to create user preference form
   */
  createUserPreferenceForm() {
    return this.fb.group({
      applicationLanguage: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      notificationLanguage: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      channel: this.fb.group({
        email: [],
        sms: []
      }),
      event: this.fb.group({
        assign: [],
        reassign: [],
        rejection: [],
        return: [],
        reopen: [],
        oLA_Breach: [],
        request_Information: [],
        provide_Information: []
      })
    });
  }
  /*
   * This method is to get admin details
   */
  getAdminDetails() {
    this.disableNotificationLanguage = true;
    this.disableContactPreference = true;
    const token = this.authService.getAuthToken();
    if (token) {
      const payload = this.authService.decodeToken(token);
      this.registrationNo = Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY));
      if (payload && payload.uid) {
        this.personIdentifier = Number(payload.uid);
        this.userActivityService
          .getAdminDetails(Number(payload.uid))
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            this.adminDetails = res;
            if (this.adminDetails && this.adminDetails) {
              this.disableNotificationLanguage = false;
              this.disableContactPreference = false;
              if (
                this.adminDetails.contactPreferences.length === 1 &&
                this.adminDetails.contactPreferences[0] === ContactPreferenceEnum.ALL
              ) {
                this.adminDetails.contactPreferences = [ContactPreferenceEnum.EMAIL, ContactPreferenceEnum.SMS];
              }
              this.userPreferences = { ...this.adminDetails };
              if (this.adminDetails.commPreferences === ApplicationLanguageEnum.EN) {
                this.userPreferenceForm
                  .get('notificationLanguage')
                  .get('english')
                  .setValue(NotificationLanguageEnum.ENGLISH_LANGUAGE);
              } else if (this.adminDetails.commPreferences === ApplicationLanguageEnum.AR) {
                this.userPreferenceForm
                  .get('notificationLanguage')
                  .get('english')
                  .setValue(NotificationLanguageEnum.ARABIC_LANGUAGE);
              }
              this.setContactPreference(this.adminDetails.contactPreferences);
            }
          });
      }
    }
  }

  /**
   * Method to set contact preference
   * @param preference
   */
  setContactPreference(preference: string[]) {
    preference.forEach(value => {
      if (value === ContactPreferenceEnum.EMAIL) {
        this.userPreferenceForm.get('channel').get('email').setValue(true);
      }
      if (value === ContactPreferenceEnum.SMS) {
        this.userPreferenceForm.get('channel').get('sms').setValue(true);
      }
    });
  }
  /*
   * This method is to select application language
   */
  getPreferredLanguage() {
    this.disableApplicationLanguage = true;
    this.userActivityService
      .getPreferredLanguage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.userPreferenceResponse = res;
        if (this.userPreferenceResponse.preferredLanguage) {
          this.disableApplicationLanguage = false;
          if (this.userPreferenceResponse?.preferredLanguage === ApplicationLanguageEnum.EN.toLowerCase()) {
            this.applicationLanguage = ApplicationLanguageEnum.EN.toLowerCase();
            this.userPreferenceForm
              .get('applicationLanguage')
              .get('english')
              .setValue(NotificationLanguageEnum.ENGLISH_LANGUAGE);
          } else if (this.userPreferenceResponse?.preferredLanguage === ApplicationLanguageEnum.AR.toLowerCase()) {
            this.applicationLanguage = ApplicationLanguageEnum.AR.toLowerCase();
            this.userPreferenceForm
              .get('applicationLanguage')
              .get('english')
              .setValue(NotificationLanguageEnum.ARABIC_LANGUAGE);
          }
        }
      });
  }
  getInternalUserNotificationPreferences() {
    const token = this.authService.getAuthToken();
    let user: string;
    if (token) {
      const payload = this.authService.decodeToken(token);
      if (payload && payload.uid) {
        user = payload.uid;
        user = user.trim();
      }
    }
    this.userActivityService
      .getInternalUserNotificationPreferences(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.internalUserNotificationPreferences = res;
        if (this.internalUserNotificationPreferences.assignmentNotification == 'true') {
          this.userPreferenceForm.get('event').get('assign').setValue(true);
        } else {
          this.userPreferenceForm.get('event').get('assign').setValue(false);
        }
        if (this.internalUserNotificationPreferences.rejectionNotification == 'true') {
          this.userPreferenceForm.get('event').get('return').setValue(true);
        } else {
          this.userPreferenceForm.get('event').get('return').setValue(false);
        }

        if (this.internalUserNotificationPreferences.applicationLang == 'ar') {
          this.applicationLanguage = ApplicationLanguageEnum.AR.toLowerCase();
          this.userPreferenceForm
            .get('applicationLanguage')
            .get('english')
            .setValue(NotificationLanguageEnum.ARABIC_LANGUAGE);
        } else {
          this.applicationLanguage = ApplicationLanguageEnum.EN.toLowerCase();
          this.userPreferenceForm
            .get('applicationLanguage')
            .get('english')
            .setValue(NotificationLanguageEnum.ENGLISH_LANGUAGE);
        }
      });
  }
  /*
   * This method is to select application language
   */
  selectApplicationLanguage(type: string) {
    if (type === NotificationLanguageEnum.ENGLISH_LANGUAGE) {
      this.applicationLanguage = ApplicationLanguageEnum.EN.toLowerCase();
    } else if (type === NotificationLanguageEnum.ARABIC_LANGUAGE) {
      this.applicationLanguage = ApplicationLanguageEnum.AR.toLowerCase();
    }
  }

  /*
   * This method is to select notification language
   */
  selectNotificationLanguage(type: string) {
    if (type === NotificationLanguageEnum.ENGLISH_LANGUAGE) {
      this.adminDetails.commPreferences = ApplicationLanguageEnum.EN;
    } else if (type === NotificationLanguageEnum.ARABIC_LANGUAGE) {
      this.adminDetails.commPreferences = ApplicationLanguageEnum.AR;
    }
  }

  onEventSelect() {
    if (
      (this.userPreferenceForm.get('event').get('assign')?.value === false ||
        this.userPreferenceForm.get('event').get('assign')?.value === null) &&
      (this.userPreferenceForm.get('event').get('reassign')?.value === false ||
        this.userPreferenceForm.get('event').get('reassign')?.value === null) &&
      (this.userPreferenceForm.get('event').get('rejection')?.value === false ||
        this.userPreferenceForm.get('event').get('rejection')?.value === null) &&
      (this.userPreferenceForm.get('event').get('reject')?.value === false ||
        this.userPreferenceForm.get('event').get('reject')?.value === null) &&
      (this.userPreferenceForm.get('event').get('reopen')?.value === false ||
        this.userPreferenceForm.get('event').get('reopen')?.value === null) &&
      (this.userPreferenceForm.get('event').get('oLA_Breach')?.value === false ||
        this.userPreferenceForm.get('event').get('oLA_Breach')?.value === null) &&
      (this.userPreferenceForm.get('event').get('request_information')?.value === false ||
        this.userPreferenceForm.get('event').get('request_information')?.value === null) &&
      (this.userPreferenceForm.get('event').get('provide_information')?.value === false ||
        this.userPreferenceForm.get('event').get('provide_information')?.value === null)
    ) {
      this.invalid = false;
    } else {
      this.invalid = true;
    }
    // this.adminDetails.notificationEvents=[];
    // if (this.userPreferenceForm) {

    //   if (this.userPreferenceForm.getRawValue().event.assign === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.ASSIGN);
    //   }

    //   if (this.userPreferenceForm.getRawValue().event.reassign === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.REASSIGN);
    //   }
    //   if (this.userPreferenceForm.getRawValue().event.reopen === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.REOPEN);
    //   }
    //   if (this.userPreferenceForm.getRawValue().event.return === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.RETURN);
    //   }
    //   if (this.userPreferenceForm.getRawValue().event.rejection === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.REJECTION);
    //   }
    //   if (this.userPreferenceForm.getRawValue().event.oLA_Breach === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.QLA_BREACH);
    //   }
    //   if (this.userPreferenceForm.getRawValue().event.provide_Information === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.PROVIDE_INFO);
    //   }
    //   if (this.userPreferenceForm.getRawValue().event.request_Information === true) {
    //     this.adminDetails.notificationEvents.push(EventPreferenceEnum.REQUEST_INFO);
    //   }

    // }
  }
  /*
   * This method is to save contact preferences
   */
  onChannelSelect() {
    if (
      (this.userPreferenceForm.get('channel').get('email')?.value === false ||
        this.userPreferenceForm.get('channel').get('email')?.value === null) &&
      (this.userPreferenceForm.get('channel').get('sms')?.value === false ||
        this.userPreferenceForm.get('channel').get('sms')?.value === null)
    ) {
      this.invalid = false;
    } else {
      this.invalid = true;
    }
    this.adminDetails.contactPreferences = [];
    if (this.userPreferenceForm) {
      if (this.userPreferenceForm.getRawValue().channel.email === true) {
        this.adminDetails.contactPreferences.push(ContactPreferenceEnum.EMAIL);
      }
      if (this.userPreferenceForm.getRawValue().channel.sms === true) {
        this.adminDetails.contactPreferences.push(ContactPreferenceEnum.SMS);
      }
    }
  }
  /*
   * Method is to show error
   */
  showError(err) {
    this.alertService.showError(err.error.message);
  }
  /**
   * Method to confirm cancel
   */

  confirmCancel() {
    this.modalRef.hide();
    this.location.back();
  }
  /**
   * Method to perform decline operation
   */
  decline() {
    this.modalRef.hide();
  }
  /**
   * Method to show modal
   * @param template
   */
  cancel(template: TemplateRef<HTMLElement>) {
    this.clearAlerts();
    this.modalRef = this.modalService.show(template);
  }
  /**
   * Method to clear all alerts
   */
  clearAlerts() {
    this.alertService.clearAlerts();
  }

  /**
   * Method to save user preferences
   */
  saveUserPreferenceDatails() {
    const token = this.authService.getAuthToken();
    let user: string;
    if (token) {
      const payload = this.authService.decodeToken(token);
      if (payload && payload.uid) {
        user = payload.uid;
        user = user.trim();
      }
    }

    const userDetails = {
      rejectionNotification: this.userPreferenceForm.get('event').get('return')?.value,
      olaBreachedNotification: false,
      applicationLang: this.applicationLanguage,
      lang: 'ar',
      assignmentNotification: this.userPreferenceForm.get('event').get('assign')?.value
    };
    this.userActivityService.saveInternalUserNotificationPreferences(userDetails, user).subscribe(
      res => {
        this.getInternalUserNotificationPreferences();
        this.alertService.showSuccessByKey('CUSTOMER-INFORMATION.PREFERENCE-UPDATED');
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  saveUserPreference() {
    this.clearAlerts();
    this.invalid = true;
    if (this.adminDetails?.contactPreferences.length === 0) {
      this.alertService.showMandatoryErrorMessage();
      this.invalid = false;
    } else {
      if (
        (this.userPreferences?.commPreferences !== this.adminDetails?.commPreferences ||
          (this.userPreferences?.contactPreferences &&
            this.adminDetails?.contactPreferences &&
            [
              ...this.userPreferences?.contactPreferences?.filter(
                x => this.adminDetails?.contactPreferences?.indexOf(x) < 0
              ),
              ...this.adminDetails?.contactPreferences?.filter(
                x => this.userPreferences?.contactPreferences?.indexOf(x) < 0
              )
            ].length > 0)) &&
        this.userPreferenceResponse?.preferredLanguage !== this.applicationLanguage &&
        this.applicationLanguage !== undefined
      ) {
        forkJoin([this.saveAdminDetails(), this.saveApplicationLanguage()]).subscribe(
          () => {
            this.userPreferences = this.adminDetails;
            this.applicationLanguage = this.userPreferenceResponse?.preferredLanguage;
            this.alertService.showSuccessByKey('CUSTOMER-INFORMATION.PREFERENCE-UPDATED');
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
      } else if (
        this.userPreferences?.commPreferences !== this.adminDetails?.commPreferences ||
        (this.userPreferences?.contactPreferences &&
          this.adminDetails?.contactPreferences &&
          [
            ...this.userPreferences?.contactPreferences.filter(
              x => this.adminDetails?.contactPreferences.indexOf(x) < 0
            ),
            ...this.adminDetails?.contactPreferences?.filter(
              x => this.userPreferences?.contactPreferences?.indexOf(x) < 0
            )
          ].length > 0)
      ) {
        this.saveAdminDetails().subscribe(
          () => {
            this.userPreferences = this.adminDetails;
            this.alertService.showSuccessByKey('CUSTOMER-INFORMATION.PREFERENCE-UPDATED');
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
      } else if (this.userPreferenceResponse?.preferredLanguage !== this.applicationLanguage) {
        this.saveApplicationLanguage().subscribe(
          () => {
            this.applicationLanguage = this.userPreferenceResponse?.preferredLanguage;
            this.alertService.showSuccessByKey('CUSTOMER-INFORMATION.PREFERENCE-UPDATED');
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
      }
    }
  }

  savePublicUserLangPreferences(){
    if (this.userPreferenceResponse?.preferredLanguage !== this.applicationLanguage) {
      this.saveApplicationLanguage().subscribe(
        () => {
          this.applicationLanguage = this.userPreferenceResponse?.preferredLanguage;
          this.alertService.showSuccessByKey('CUSTOMER-INFORMATION.PREFERENCE-UPDATED');
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /**
   * Method to save admin details
   */
  saveAdminDetails() {
    return this.userActivityService.savePreferences(this.adminDetails, this.personIdentifier).pipe(
      tap(() => {
        this.getAdminDetails();
      })
    );
  }
  /*
   * This method is to save application language
   */
  saveApplicationLanguage() {
    const userPreferenceRequest = new UserPreferenceRequest();
    userPreferenceRequest.languagePreference = this.applicationLanguage;
    return this.userActivityService.saveApplicationLanguage(userPreferenceRequest).pipe(
      tap(() => {
        this.getPreferredLanguage();
      })
    );
  }
  /**
   * Method to check button status
   */
  isDisabled() {
    if (
      (this.adminDetails &&
        ((this.userPreferences?.commPreferences &&
          this.userPreferences?.commPreferences !== this.adminDetails?.commPreferences) ||
          (this.userPreferences?.contactPreferences &&
            this.adminDetails?.contactPreferences &&
            this.userPreferences?.contactPreferences?.length >= 0 &&
            this.adminDetails?.contactPreferences?.length >= 0 &&
            [
              ...this.userPreferences?.contactPreferences?.filter(
                x => this.adminDetails?.contactPreferences?.indexOf(x) < 0
              ),
              ...this.adminDetails?.contactPreferences?.filter(
                x => this.userPreferences?.contactPreferences?.indexOf(x) < 0
              )
            ].length > 0))) ||
      (this.userPreferenceResponse?.preferredLanguage !== this.applicationLanguage &&
        this.applicationLanguage !== undefined)
    ) {
      return false;
    } else return true;
  }
}
