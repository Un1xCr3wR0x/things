/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { 
  Component,
  EventEmitter,
  HostListener, 
  Inject, 
  Input,
  OnChanges, 
  OnInit, 
  Output, 
  SimpleChanges 
} from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken,  LanguageToken, RoleIdEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { DiseaseHistory } from '../../shared/models/disease-history';
import { OhService } from '../../shared';

@Component({
  selector: 'oh-view-disease-dc',
  templateUrl: './view-disease-dc.component.html',
  styleUrls: ['./view-disease-dc.component.scss']
})
export class ViewDiseaseDcComponent implements OnInit, OnChanges {
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
   diseaseName: string;
   color: string;
   diseaseStatus: string;
   isAppPrivate = false;
   readonly router: Router;
   width: number;
   mobileView: boolean;
   userRole: RoleIdEnum[] = [];
   userRoles: RoleIdEnum[] = [];
    // input variables
  @Input() diseaseHistory: DiseaseHistory;
  @Input() isLoading: boolean;
  @Input() isHeading: boolean;
  @Input() establishment;
  @Input() isDisabled: boolean;
  @Input() roleValidation = [];
  @Output() diseaseSelected: EventEmitter<DiseaseHistory> = new EventEmitter();
  @Output() compSelected: EventEmitter<DiseaseHistory> = new EventEmitter(); //tODO: use camel case for variables and give meaningful names
  @Output() addComplicationNotAllowed: EventEmitter<boolean> = new EventEmitter();
  @Output() reportComplication: EventEmitter<DiseaseHistory> = new EventEmitter();

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
        RoleIdEnum.OCCUPATIONAL_HEALTH_SAFETY_ENGINEER,
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
        RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST
      );
    } else {
      this.userRole.push(RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN);
    }
    this.userRoles.push(
      ...this.userRole.map(function (value) {
        return value;
      })
    );
    this.language.subscribe(language => {
      this.lang = language;
    });
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
    if (changes && changes.diseaseHistory) {
      this.diseaseHistory = changes.diseaseHistory.currentValue;
    }
    if (changes && changes.isDisabled) {
      this.isDisabled = changes.isDisabled.currentValue;
    }
    if (changes && changes.isHeading) {
      this.isHeading = changes.isHeading.currentValue;
    }
  }
  /**
   * Method to rmit values to sc
   * @param diseaseHistory
   * @param Complication
   */

  viewDiseaseDetails(diseaseHistory: DiseaseHistory) {
    this.diseaseSelected.emit(diseaseHistory);
  }
   /**
   * Method to navigate to report complication
   * @param diseaseHistory
   *
   */
  addComplication(diseaseHistory : DiseaseHistory) {
    this.reportComplication.emit(diseaseHistory);
  //  this.ohService.setIsDisease(true);
  }
  /**
   * Method to emit the disease details of the corresponding complication
   * @param diseaseHistory
   *
   */
  viewComplication(diseaseHistory: DiseaseHistory) {
    this.compSelected.emit(diseaseHistory); 
  }
  getColor(status) {
    switch (status.english) {
      case 'Approved':
        {
          this.color = 'green';
        }
        break;
      case 'In Progress':
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
    }
    return this.color;
  }
}
