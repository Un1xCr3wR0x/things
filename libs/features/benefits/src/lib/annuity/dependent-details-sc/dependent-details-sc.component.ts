/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  TemplateRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DependentBaseComponent } from '../base/dependent.base-component';
import { TableHeadingAndParamName, ActionType, PersonalInformation, AnnuityResponseDto } from '../../shared';
import { getObjForValidate } from '../../shared/utils/validateDependentUtils';
import { GosiCalendar, scrollToTop } from '@gosi-ui/core';
@Component({
  selector: 'bnt-dependent-details-sc',
  templateUrl: './dependent-details-sc.component.html',
  styleUrls: ['./dependent-details-sc.component.scss']
})
export class DependentDetailsScComponent extends DependentBaseComponent implements OnInit, OnChanges {
  @Input() parentForm: FormGroup;
  @Input() isAppPrivate: boolean;
  @Input() isIndividualApp: boolean;
  @Input() isLumpsum = false;
  @Input() benefitType: string;
  @Input() contributorDetails: PersonalInformation;
  @Input() disableSaveAndNext = false;
  @Input() isPension = false;
  @Input() maxDate;
  @Input() showPrevButton = false;
  @Input() lateRequest: boolean;
  @Input() newRequestDate: GosiCalendar;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() systemRunDate: GosiCalendar;
  @Input() requestDateChangedByValidator: boolean;
  // @Input() isEligibleForBackdated: boolean;
  /**
   * Output
   */
  @Output() getDependentsByDate: EventEmitter<GosiCalendar> = new EventEmitter();
  @Output() selectedPeriodImprisonment = new EventEmitter(); //remove
  @Output() previousForm: EventEmitter<boolean> = new EventEmitter(); //remove
  showSearch: boolean;
  isSmallScreen: boolean;
  tableHeadingAndParams: TableHeadingAndParamName[] = [
    {
      heading: 'BENEFITS.DEPENDENT-NAME',
      parameterName: 'name'
    },
    /** NIN id showing along with the name, dep:new VD changes */
    // {
    //   heading: 'BENEFITS.NATIONAL-ID',
    //   parameterName: 'id'
    // },
    {
      heading: 'BENEFITS.RELATIONSHIP-WITH-CONTRIBUTOR',
      parameterName: 'relationship'
    },
    {
      heading: 'BENEFITS.DATE-OF-BIRTH-AGE-CAP',
      parameterName: 'ageWithDob'
    }
  ];

  ngOnInit(): void {
    //get systemParameter, systemRunDate
    //TODO: new api to be called
    this.getScreenSize();
    this.getStystemParamAndRundate();
    // this.initRelationShipLookup();
    this.initHeirStatusLookup();
    this.initMaritalStatusLookup();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isIndividualApp && changes && changes.systemRunDate?.currentValue) {
      this.getDependents(this.systemRunDate);
    }
  }
  imprisonmentPeriodSelected(event) {
    this.selectedPeriodImprisonment.emit(event);
  }

  showHeader() {
    const listWithOutModify = this.listOfDependents?.filter(eachDep => {
      return eachDep.actionType !== ActionType.REMOVE;
    });
    return listWithOutModify?.length;
  }
  addAnotherDependent() {
    this.listOfDependents.forEach(element => {
      element.editable = false;
    });
    this.addDependent = true;
  }
  applyForBenefit() {
    this.saveDependent(getObjForValidate(this.listOfDependents));
  }
  getDependents(date: GosiCalendar) {
    this.getDependentsByDate.emit(date);
  }
  /**
   * To get screen size
   */
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }
}
