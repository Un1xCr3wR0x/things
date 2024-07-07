import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { EngagementDetails, SearchEngagementResponse } from '@gosi-ui/features/contributor/lib/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-enter-rpa-engagement-details-dc',
  templateUrl: './enter-rpa-engagement-details-dc.component.html',
  styleUrls: ['./enter-rpa-engagement-details-dc.component.scss']
})
export class EnterRpaEngagementDetailsDcComponent implements OnInit {

  lang = 'en';
  totalGOSIContributionMonths: any;
  appointmentNumber: any;
  appointmentDate: any;
  totalPpaContributionMonth: any;
  activeEngagements: any;
  overallEngagements: any;
  wageBreakPeriod: any;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,) { }

   /**
   * Input variables
   */
   @Input() engagementDetails: SearchEngagementResponse;
   @Input() isFirstScheme: boolean;
   
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   debugger
  //   if(changes.engagementDetails.currentValue){
  //     this.totalGOSIContributionMonths = changes.engagementDetails.currentValue.totalGOSIContributionMonths;
  //     this.appointmentNumber = changes.engagementDetails.currentValue.appointmentNumber;
  //     this.appointmentDate = changes.engagementDetails.currentValue.appointmentDate;
  //     this.totalPpaContributionMonth = changes.engagementDetails.currentValue.totalPpaContributionMonth;
  //     this.activeEngagements = changes.engagementDetails.currentValue.activeEngagements[0];
  //     this.overallEngagements = changes.engagementDetails.currentValue.overallEngagements;
  //     this.wageBreakPeriod = changes.engagementDetails.currentValue.wageBreakPeriod;
  //   }
  // }

}
