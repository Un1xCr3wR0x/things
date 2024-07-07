/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, checkNull, LanguageToken, RoleIdEnum } from '@gosi-ui/core';
import { InjuryHistory } from '../../shared/models';
import { BehaviorSubject } from 'rxjs';
import { OhService } from '../../shared';

@Component({
  selector: 'oh-view-injury-dc',
  templateUrl: './view-injury-dc.component.html',
  styleUrls: ['./view-injury-dc.component.scss']
})
export class ViewInjuryDcComponent implements OnInit, OnChanges {
  class: string;
  /**
   *
   * @param appToken Creating an instance
   */
  constructor(
    readonly ohService: OhService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  //local variables
  lang = 'en';
  injuryName: string;
  color: string;
  injuryStatus: string;
  isAppPrivate = false;
  readonly router: Router;
  width: number;
  mobileView: boolean;
  userRole: RoleIdEnum[] = [];
  userRoles: RoleIdEnum[] = [];
  // input variables
  @Input() injuryHistory: InjuryHistory;
  @Input() isLoading: boolean;
  @Input() isHeading: boolean;
  @Input() establishment;
  @Input() isDisabled: boolean;
  @Input() roleValidation = [];
  @Input() lastInjury: boolean;
  @Output() injurySelected: EventEmitter<InjuryHistory> = new EventEmitter();
  @Output() compSelected: EventEmitter<InjuryHistory> = new EventEmitter(); //tODO: use camel case for variables and give meaningful names
  @Output() addComplicationNotAllowed: EventEmitter<boolean> = new EventEmitter();
  @Output() reportComplication: EventEmitter<InjuryHistory> = new EventEmitter();

  //oninit method

  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if (this.isAppPrivate) {
      this.userRole.push(
        RoleIdEnum.BOARD_OFFICER,
        RoleIdEnum.CSR,
        RoleIdEnum.CLM_MGR,
        RoleIdEnum.CUSTOMER_CARE_OFFICER,
        RoleIdEnum.CALL_CENTRE_AGENT,
        RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
        RoleIdEnum.DOCTOR,
        RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
        RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
        RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
        RoleIdEnum.MEDICA_AUDITOR,
        RoleIdEnum.MC_OFFICER,
        RoleIdEnum.MS_OFFICER,
        RoleIdEnum.MEDICAL_BOARD_SECRETARY,
        RoleIdEnum.OH_OFFICER,
        RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
        RoleIdEnum.FC,
        RoleIdEnum.OH_FC,
        RoleIdEnum.FEATURE_360_ALL_USER,
        RoleIdEnum.GDISO,
        RoleIdEnum.GCC_CSR,
        RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
        RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER,
        RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER,
        RoleIdEnum.HEAD_OFFICE_DOCTOR
      );
    } else {
      this.userRole.push(RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.SUBSCRIBER);
    }
    this.userRoles.push(
      ...this.userRole.map(function (value) {
        return value;
      })
    );
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.injuryHistory.establishmentName.english =
      this.lang === 'en' && !checkNull(this.injuryHistory.establishmentName.english)
        ? this.injuryHistory.establishmentName.english
        : this.injuryHistory.establishmentName.arabic;

    if (this.injuryHistory.status.english == 'Closed without continuing treatment') {
      this.class = 'custom-class';
    }
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (this.width < 1023) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
  /**
   *Method to detect changes in input
   * @param changes Capturing input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryHistory) {
      this.injuryHistory = changes.injuryHistory.currentValue;
    }
    if (changes && changes.isDisabled) {
      this.isDisabled = changes.isDisabled.currentValue;
    }
    if (changes && changes.isHeading) {
      this.isHeading = changes.isHeading.currentValue;
    }
    if (changes && changes.lastInjury) {
      this.lastInjury = changes.lastInjury.currentValue;
    }
  }
  /**
   * Method to rmit values to sc
   * @param injuryHistory
   * @param Complication
   */

  viewInjuryDetails(injuryHistory: InjuryHistory) {
    this.injurySelected.emit(injuryHistory);
  }

  /**
   * Method to navigate to report complication
   * @param injuryHistory
   *
   */
  addComplication(injuryHistory: InjuryHistory) {
    this.reportComplication.emit(injuryHistory);
 //   this.ohService.setIsDisease(false);
  }

  /**
   * Method to emit the injury details of the corresponding complication
   * @param injuryHistory
   *
   */
  viewComplication(injuryHistory: InjuryHistory) {
    this.compSelected.emit(injuryHistory);
  }
  getColor(status) {
    if (status.english == 'Closed without continuing treatment') {
      this.class = 'custom-class';
    }
    switch (status.english) {
      case 'Approved':
        {
          this.color = 'green';
        }
        break;
      case 'In Progress':
      case 'Pending':
        {
          this.color = 'orange';
        }
        break;
      case 'Cancelled':
      case 'Cancelled By System':
      case 'Cured With Disability':
      case 'Cured Without Disability':
      case 'Closed without continuing treatment':
      case 'Closed':
      case 'Resulted in Death':
        {
          this.color = 'grey';
        }
        break;
      case 'Rejected':
        {
          this.color = 'red';
        }
        break;
      case 'Pending with admin':
        {
          this.color = 'orange';
        }
        break;
    }
    return this.color;
  }
}
