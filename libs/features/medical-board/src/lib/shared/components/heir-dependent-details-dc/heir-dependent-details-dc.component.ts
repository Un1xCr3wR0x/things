import { Component, Input, OnInit } from '@angular/core';
import { CommonIdentity, IdentityTypeEnum, checkIqamaOrBorderOrPassport } from '@gosi-ui/core';
import { AssessmentDetail } from '../../models/assessment-details';


@Component({
  selector: 'mb-heir-dependent-details-dc',
  templateUrl: './heir-dependent-details-dc.component.html',
  styleUrls: ['./heir-dependent-details-dc.component.scss']
})
export class HeirDependentDetailsDcComponent implements OnInit {
@Input() assessmentDetails: AssessmentDetail;
identityLabel = '';
  constructor() { }

  ngOnInit(): void {
    this.getIdentifier();
  }
getIdentifier(){
      this.identityLabel = this.getIdentityLabel(this.assessmentDetails?.heirDependantDetails?.identity);
}

getIdentityLabel(identity){
  let label = '';
  if (identity?.idType === IdentityTypeEnum.NIN) {
    label = 'MEDICAL-BOARD.NATIONAL-ID';
  } else if (identity?.idType === IdentityTypeEnum.IQAMA || identity?.idType === 'Iqama') {
    label = 'MEDICAL-BOARD.IQAMA-NUMBER';
  } else if (identity?.idType === IdentityTypeEnum.PASSPORT || identity?.idType === 'Passport') {
    label = 'MEDICAL-BOARD.PASSPORT-NO';
  } else if (identity?.idType === IdentityTypeEnum.NATIONALID || identity?.idType === 'GCCId') {
    label = 'MEDICAL-BOARD.GCC-NIN';
  } else if (identity?.idType === IdentityTypeEnum.BORDER) {
    label = 'MEDICAL-BOARD.BORDER-NO';
  } else {
    label = 'MEDICAL-BOARD.NATIONAL-ID';
  }
  return label;
}
}
