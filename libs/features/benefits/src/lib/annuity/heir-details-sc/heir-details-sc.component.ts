/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { HeirBaseComponent } from '../base/heir.base-component';
import {
  HeirDetailsRequest,
  TableHeadingAndParamName,
  HeirPersonIds,
  PersonalInformation,
  BenefitDetails,
  DependentHeirConstants,
  Benefits,
  showErrorMessage,
  BenefitValues,
  EventResponseDto
} from '../../shared';
import { scrollToTop, ContactDetails, BilingualText } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

@Component({
  selector: 'bnt-heir-details-sc',
  templateUrl: './heir-details-sc.component.html',
  styleUrls: ['./heir-details-sc.component.scss']
})
export class HeirDetailsScComponent extends HeirBaseComponent implements OnInit {
  //Input variables

  @Input() isAppPrivate: boolean;
  @Input() heirDetailsData: HeirDetailsRequest;
  @Input() disableSaveAndNext: boolean;
  @Input() benefitCalculation: BenefitDetails;
  @Input() isBankAccountRequired = true;
  //output variables
  @Output() previous: EventEmitter<null> = new EventEmitter();

  // highlightInvalid = false;
  tableHeadingAndParams: TableHeadingAndParamName[] = [
    {
      heading: 'BENEFITS.HEIR_NAME',
      parameterName: 'name'
    },
    // {
    //   heading: 'BENEFITS.IDENTIFICATION_NUMBER',
    //   parameterName: 'id'
    // },
    {
      heading: 'BENEFITS.RELATIONSHIP-WITH-CONTRIBUTOR',
      parameterName: 'relationship'
    },
    // {
    //   heading: 'BENEFITS.HEIR_AGE',
    //   parameterName: 'age'
    // }
    {
      heading: 'BENEFITS.DATE-OF-BIRTH-AGE-CAP',
      parameterName: 'ageWithDob'
    }
  ];

  ngOnInit(): void {
    // this.initRelationShipLookup();
    super.ngOnInit();
    this.initHeirStatusLookup();
    this.initPaymentMethod();
    this.initialisePayeeType();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
    // this.getSystemParamAndRundate();
    this.initMaritalStatusLookup();
    this.initYesOrNoLookup();
    this.searchResult = new PersonalInformation();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.getScreenSize();
  }

  previousForm() {
    this.previous.emit();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  applyForBenefit() {
    this.alertService.clearAlerts();
    if (this.heirDetails.length) {
      const invalidHeirs = this.heirDetails.filter(eachHeir => {
        return eachHeir.showMandatoryDetails;
      });
      const eligibleHeirs = this.heirDetails?.filter(eachHeir => {
        return (
          eachHeir?.statusAfterValidation?.english === DependentHeirConstants?.eligible().english ||
          eachHeir?.statusAfterValidation?.english === DependentHeirConstants?.eligibleForBackdated().english
        );
      });
      if (invalidHeirs.length) {
        // this.highlightInvalid = true;
        invalidHeirs.forEach(heir => {
          heir.showBorder = true;
        });

        this.alertService.showErrorByKey('BENEFITS.ENTER-MANDATORY-DETAILS');
        scrollToTop();
      } else if (eligibleHeirs?.length) {
        const heirRequestDetails = new HeirDetailsRequest();
        heirRequestDetails.eventDate = this.heirDetailsData?.eventDate;
        heirRequestDetails.reason = this.heirDetailsData?.reason;
        heirRequestDetails.heirDetails = this.heirDetails;
        this.save.emit(heirRequestDetails);
      } else {
        this.alertService.showErrorByKey('BENEFITS.NOT-ELIGIBLE');
      }
    }
  }

  /*
   * This method is for showing the add heir block
   */
  showOrHideSearch() {
    this.showSearch = !this.showSearch;
    this.heirDetails.forEach(element => {
      element.editable = false;
    });
  }

  // method to edit dependent
  edit(index: number) {
    this.validateApiResponse = null;
    this.events$ = new BehaviorSubject(new EventResponseDto());
    if (this.heirDetails[index].editable) {
      this.heirDetails[index].editable = false;
    } else {
      this.heirDetails.forEach(element => {
        element.editable = false;
      });
      this.heirDetails[index].errorMsg = null;
      //Get authorized persons list
      // if(this.heirDetails[index].newlyAdded) {
      if (this.heirDetails[index].identity) {
        this.getAttorneyList(this.heirDetails[index].identity);
      }
      // this.getModificationReason(this.heirDetails[index].personId);
      const gender = this.heirDetails[index].gender ? this.heirDetails[index].gender : this.heirDetails[index].sex;
      this.annuityRelationShip$ = this.getRelationShipByGender(gender, this.eligibleForPensionReform);
      if (
        this.heirDetails[index].relationship?.english === BenefitValues.unborn ||
        // this.heirDetails[index].dependentSource === BenefitValues.moj ||
        // this.heirDetails[index].dependentSource === BenefitValues.nic ||
        this.heirDetails[index].hasMandatoryDetails ||
        (this.isValidator && !this.isDraft)
      ) {
        this.heirDetails[index].editable = true;
      } else {
        this.getEventsForModify(this.heirDetails[index].personId);
      }
      if (this.heirDetails[index].guardianPersonId) {
        this.getGuardianDetails(this.heirDetails[index].guardianPersonId.toString());
      }
    }
  }

  getAuthPeronContactDetails(ids: HeirPersonIds) {
    this.manageBenefitService.getPersonDetailsWithPersonId(ids.authPersonId.toString()).subscribe(personalDetails => {
      if (personalDetails.contactDetail) {
        this.setContactDetail(personalDetails.contactDetail, ids.HeirId);
      } else {
        this.setContactDetail(null, ids.HeirId);
      }
    });
  }

  setContactDetail(contactDetail: ContactDetails, heirId: number) {
    if (this.searchResult.personId) {
      this.searchResult.agentContactDetails = contactDetail;
    } else {
      this.heirDetails.forEach((item, index) => {
        if (item.personId === heirId) {
          this.heirDetails[index].agentContactDetails = contactDetail;
        }
      });
    }
  }
}
