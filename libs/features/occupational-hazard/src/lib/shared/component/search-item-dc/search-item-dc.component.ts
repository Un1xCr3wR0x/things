/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { checkNull, getIconText, getIdentityByType, getPersonName, LanguageToken, CommonIdentity } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ContributorSearchResult } from '../../models';

@Component({
  selector: 'oh-search-item-dc',
  templateUrl: './search-item-dc.component.html',
  styleUrls: ['./search-item-dc.component.scss']
})
export class SearchItemDcComponent implements OnInit, OnChanges {
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /**
   * input variables
   */
  @Input() contributor: ContributorSearchResult = new ContributorSearchResult();

  /**
   * Output events
   */
  @Output() selectContributor: EventEmitter<ContributorSearchResult> = new EventEmitter();
  @Output() alert: EventEmitter<null> = new EventEmitter();

  /**
   * local variables
   */
  personName: string;
  iconName: string;
  lang = 'en';
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;

  active = false;

  toggleEngagementDetails = false;

  //new code

  /**
   * This method is to handle initialization tasks
   */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
      this.setPersonDetails();
    });
  }

  /**
   *
   * @param changes Capturing input on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributor && changes.contributor.currentValue != null) {
      this.contributor = changes.contributor.currentValue;
      this.setPersonDetails();
    }
  }

  /**
   *
   * @param contributor This method is to emit the values to sc
   */
  selectContributorFn() {
    if (this.primaryIdentityType == null) {
      this.showAlert();
    } else {
      this.selectContributor.emit(this.contributor);
    }
  }

  /**
   * This method is set Icon Name
   * @param transaction
   */
  setIconName(lang) {
    return getIconText(this.contributor.person.name, lang);
  }

  /**
   * Setting name details
   */
  setPersonDetails() {
    if (this.contributor.person) {
      this.personName = getPersonName(this.contributor.person.name, this.lang);
      this.personName = !checkNull(this.personName) ? this.personName : null;
      this.iconName = this.setIconName(this.lang);

      /**
       * getting the identity type for the contributor eg:iqama number border number
       */
      this.primaryIdentity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
          : null;

      this.primaryIdentityType =
        this.primaryIdentity !== null ? 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType : null;
    }
  }

  /**
   * Private method to show the alert when no identity details available
   */
  private showAlert() {
    this.alert.emit();
  }
}
