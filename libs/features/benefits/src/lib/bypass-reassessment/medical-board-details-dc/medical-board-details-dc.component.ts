import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssessmentDetails } from '../../shared/models';
import { checkIqamaOrBorderOrPassport, CommonIdentity, formatDate, IdentityTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'bnt-medical-board-details-dc',
  templateUrl: './medical-board-details-dc.component.html',
  styleUrls: ['./medical-board-details-dc.component.scss']
})
export class MedicalBoardDetailsDcComponent implements OnInit {
  limitvalue: number;
  limit = 100;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-DESCRIPTION';
  //Input Variables
  @Input() assessmentDetails: AssessmentDetails;
  @Input() lang = 'en';
  @Input() isStandAlone: boolean;
  @Output() onContributorIdClicked = new EventEmitter();

  disabledIdentityLabel = ' ';

  constructor() {}

  ngOnInit(): void {
    if (this.assessmentDetails) {
      this.assessmentDetails.disabledIdentity = checkIqamaOrBorderOrPassport(
        this.assessmentDetails?.disabledIdentifier
      );
      // this.getIdentityLabel(value);
    }
  }
  readFullDescription(noteText: string) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'BENEFITS.READ-LESS-DESCRIPTION';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'BENEFITS.READ-FULL-DESCRIPTION';
    }
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  getIdentityLabel(idObj: CommonIdentity) {
    let label = '';
    if (idObj?.idType === IdentityTypeEnum.NIN) {
      label = 'BENEFITS.NIN-ID';
    } else if (idObj?.idType === IdentityTypeEnum.IQAMA) {
      label = 'BENEFITS.IQAMA-NUMBER';
    } else if (idObj?.idType === IdentityTypeEnum.PASSPORT) {
      label = 'BENEFITS.PASSPORT-NO';
    } else if (idObj?.idType === IdentityTypeEnum.NATIONALID) {
      label = 'BENEFITS.GCC-NIN';
    } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
      label = 'BENEFITS.BORDER-NO';
    }
    return label;
  }
  onNavigateToContributor(id) {
    if (!this.isStandAlone) {
      this.onContributorIdClicked.emit(id);
    }
  }
}
