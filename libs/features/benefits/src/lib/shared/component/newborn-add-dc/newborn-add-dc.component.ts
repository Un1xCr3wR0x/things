import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HeirBaseComponent } from '../../../annuity/base/heir.base-component';
import { ContactDetails, GenderEnum, GosiCalendar } from '@gosi-ui/core';
import { DependentDetails, HeirDetailsRequest, HeirPersonIds, SearchPerson } from '../../models';
import { DependentHeirConstants } from '../../constants';

@Component({
  selector: 'bnt-newborn-add-dc',
  templateUrl: './newborn-add-dc.component.html',
  styleUrls: ['./newborn-add-dc.component.scss']
})
export class NewbornAddDcComponent extends HeirBaseComponent implements OnInit, OnChanges {
  @Input() benefitStartDate: GosiCalendar;
  @Input() reasonForBenefit: HeirDetailsRequest;
  @Input() isModifyPage: boolean;
  @Output() addNewBornHeir: EventEmitter<DependentDetails> = new EventEmitter<DependentDetails>();

  ngOnInit(): void {
    this.page = 'modify';
    this.initializeParameters();
    this.resetSearch();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.reasonForBenefit?.currentValue) {
      this.heirDetailsData = this.reasonForBenefit;
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

  addNewBorn(data: DependentDetails) {
    this.addNewBornHeir.emit(data);
  }

  searchNewBorn(data: SearchPerson) {
    data.newBorn = true;
    this.search(data, this.benefitStartDate);
  }

  validateNewBorn(event: DependentDetails) {
    event.gender =
      event.relationship.english === DependentHeirConstants.DaughterBilingual.english
        ? DependentHeirConstants.FeMaleBilingual
        : DependentHeirConstants.MaleBilingual;
    event.sex = event.gender;
    event.unbornModificationReason = this.dependentDetails.unbornModificationReason;
    event.modifiedUnborn = true;
    this.validateHeir(event);
  }
}
