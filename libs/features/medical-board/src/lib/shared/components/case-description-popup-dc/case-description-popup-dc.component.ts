import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AssessmentDetail } from '../../models';

@Component({
  selector: 'mb-case-description-popup-dc',
  templateUrl: './case-description-popup-dc.component.html',
  styleUrls: ['./case-description-popup-dc.component.scss']
})
export class CaseDescriptionPopupDcComponent implements OnInit {
  constructor() {}
  @Input() caseDescription: AssessmentDetail;

  @Output() onCloseModal = new EventEmitter<null>();
  
  ngOnInit(): void {}
  getDescriptionString(caseArr: string[]): string {
    if(caseArr)
    return caseArr?.toString();
    else return '';
  }
}
