/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  Alert,
  AlertService,
  BilingualText,
  checkNull,
  CommonIdentity,
  getIdentityByType,
  getPersonName,
  LanguageToken,
  FeedbackStatus,
  Person
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Injury, InjuryFeedback } from '../../shared/models';
import { RouteConstants } from '../../shared/constants';

@Component({
  selector: 'oh-feedback-injury-dc',
  templateUrl: './feedback-dc.component.html',
  styleUrls: ['./feedback-dc.component.scss']
})
export class FeedbackDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  transactionMessage: BilingualText = null;
  nationality: BilingualText; //TODO: use proper name Obj is not necessary
  feedbackStatus = FeedbackStatus;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  lang = 'en';
  name: string;
  showDetails = false;
  feedback: Alert;

  /**
   * Input variables
   */
  @Input() personDetails: Person = new Person();
  @Input() injuryNumber: number;
  @Input() reportedInjuryInformation: Injury = new Injury();
  @Input() feedbackdetails: InjuryFeedback = new InjuryFeedback();

  /**
   *
   * @param language Creating an instance
   * @param router
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly alertService: AlertService
  ) {}
  /**
   * This method is to handle initialization tasks
   */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
      this.setNameDetails();
    });
  }
  /**
   * This method is to navigate to home page
   */
  navigate() {
    this.router.navigate([RouteConstants.ROUTE_REPORT_TYPE]);
  }
  /**
   *
   * @param changes Capturing the changes in input
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.feedbackdetails) {
      this.feedbackdetails = changes.feedbackdetails.currentValue;
      this.feedbackDetails();
    }
    if (changes && changes.personDetails) {
      if (this.personDetails) {
        this.setNameDetails();

        this.nationality = this.personDetails.nationality;
        /**
         * getting the identity type for the contributor eg:iqama number border number
         */
        this.primaryIdentity = getIdentityByType(this.personDetails.identity, this.personDetails.nationality.english);
        this.primaryIdentityType = 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType;
      }
    }
    if (this.feedbackdetails !== null || undefined) {
      this.showDetails = this.feedbackdetails.status.english === 'Rejected' ? false : true;
    }
  }
  /**
   * Setting the name
   */
  setNameDetails() {
    /**
     * getting the name for the search result
     */
    if (this.personDetails) {
      const nameObj = getPersonName(this.personDetails.name, this.lang);
      this.name = nameObj;
      if (checkNull(nameObj)) {
        this.name = null;
      }
    }
  }
  /**
   * Set the feedback messages
   */
  feedbackDetails() {
    this.feedback = new Alert();
    if (this.feedbackdetails.status.english != null) {
      if (
        this.feedbackdetails.status.english === FeedbackStatus.APPROVED ||
        this.feedbackdetails.status.english === FeedbackStatus.PENDING
      ) {
        this.feedback.message = this.feedbackdetails.transactionMessage;
      } else {
        this.feedback.message = this.feedbackdetails.transactionMessage;
      }
    }
  }
}
