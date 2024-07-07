import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'gosi-ui-assessment-view-dc',
  templateUrl: './assessment-view-dc.component.html',
  styleUrls: ['./assessment-view-dc.component.scss']
})
export class AssessmentViewDcComponent implements OnInit {
  @Input() assessmentDetails;
  @Input() singleAssessmentDetails;
  @Input() helperRequired = false;
  helperReasons: BilingualText;

  modalRef: BsModalRef;
  limitvalue = 100;
  disabledBodyPart: BilingualText;

  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {}
  ngOnChanges() {
    if (this.singleAssessmentDetails?.bodyPartsList?.length > 0 && this.singleAssessmentDetails?.bodyPartsList[0]?.bodyParts) {
      this.singleAssessmentDetails?.bodyPartsList[0]?.bodyParts.forEach(bodyPart => {
        this.disabledBodyPart = bodyPart;
      });
    }
    // if (
    //   this.singleAssessmentDetails?.bodyPartsList[0]?.bodyParts &&
    //   this.singleAssessmentDetails?.modifiedDetails?.bodyPartsLists?.length > 0
    // ) {
    //   this.singleAssessmentDetails?.bodyPartsList[0]?.bodyParts.forEach(bodyPart => {
    //     this.disabledBodyPart = bodyPart;
    //   });
    // }
  }

  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  getDescriptionString(caseArr: string[]): string {
    if(caseArr)
    return caseArr?.toString();
    else return '';
  }
}
