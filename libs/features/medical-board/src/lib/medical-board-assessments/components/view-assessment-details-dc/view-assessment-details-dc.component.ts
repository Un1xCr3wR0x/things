import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { statusBadgeType } from '@gosi-ui/core/lib/utils/common';
import { AssessmentDetails, DisabilityDetails } from '../../../shared/models/disability-assessment';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { MBConstants } from '../../../shared';

@Component({
  selector: 'mb-view-assessment-details-dc',
  templateUrl: './view-assessment-details-dc.component.html',
  styleUrls: ['./view-assessment-details-dc.component.scss']
})
export class ViewAssessmentDetailsDcComponent implements OnInit {
  lang = 'en';
  @Input() id: string;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() totalItems: number;
  @Input() index = 0;
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Output() navigate: EventEmitter<AssessmentDetails> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    // setTimeout(() => {
    //   if (this.previousDisabilityDetails) this.updateTime();
    // }, 10);
  }
  ngOnchanges(changes: SimpleChanges) {
    if (changes && changes.previousDisabilityDetails && changes.previousDisabilityDetails.currentValue) {
      this.previousDisabilityDetails = changes.previousDisabilityDetails.currentValue;
      // this.updateTime();
    }
  }
  // updateTime() {
  //   if (this.previousDisabilityDetails) {
  //     this.previousDisabilityDetails?.data?.forEach(value => {
  //       const dateArray = value?.assessmentTime?.english?.split('::');

  //       if (dateArray) dateArray[1] = dateArray[1] !== undefined ? dateArray[1] : '00';

  //       if (dateArray && dateArray[0] && Number(dateArray[0]) >= 12) {
  //         if (Number(dateArray[0]) > 12) {
  //           value.assessmentTime.english = Number(dateArray[0]) - 12 + ':' + dateArray[1] + ' ';
  //         }
  //         if (Number(dateArray[0]) == 12) {
  //           value.assessmentTime.english = Number(dateArray[0]) + ':' + dateArray[1] + ' ';
  //         }
  //         value.startTimeAmOrPm = MBConstants.PM;
  //       } else {
  //         value.startTimeAmOrPm = MBConstants.AM;
  //         if (dateArray && dateArray[0] === '00') {
  //           value.assessmentTime.english = '12:' + dateArray[1] + ' ';
  //         } else {
  //           value.assessmentTime.english = dateArray[0] + ':' + dateArray[1] + ' ';
  //         }
  //       }
  //     });
  //   }
  // }
  statusBadgeType(status: BilingualText) {
    return statusBadgeType(status.english);
  }
  onNavigate(item: AssessmentDetails) {
    this.navigate.emit(item);
  }
}
