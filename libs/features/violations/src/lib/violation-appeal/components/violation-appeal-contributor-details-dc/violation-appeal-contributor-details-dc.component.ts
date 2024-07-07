import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DocumentItem} from "@gosi-ui/core";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ContributorDetail} from "@gosi-ui/features/violations/lib/shared/models/contributor-detail";
import {FormArray, FormGroup} from "@angular/forms";

@Component({
  selector: 'vol-violation-appeal-contributor-details-dc',
  templateUrl: './violation-appeal-contributor-details-dc.component.html',
  styleUrls: ['./violation-appeal-contributor-details-dc.component.scss']
})
export class ViolationAppealContributorDetailsDcComponent
  implements OnInit {


  @Input() contributorList: ContributorDetail[];
  @Input() formsContributor: FormGroup;
  @Output() submitForm: EventEmitter<null> = new EventEmitter();
  @Input() selectedContributors: boolean[] = [];
  @Output() addDocument: EventEmitter<number> = new EventEmitter();
  @Output() changeRow: EventEmitter<number> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Input() uuid: string;
  @Input() totalRecords: number;
  @Input() documentItems;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  submit: boolean;
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @ViewChild('showTemplate', {static: false}) modalRef: BsModalRef;
  accordionPanel = 1;
  @Input() documentsValid: boolean[] = [];
  @Input() isSubmit: boolean;
  @Input() transactionId: string;

  constructor() {  }

  ngOnInit(): void {  }

  get contributorFormArray(): FormArray {
    return this.formsContributor.get('contributors') as FormArray;
  }


  onSubmit() {
    this.submitForm.emit(null);
  }

  onSelectedChangeShow(i: number) {
    this.changeRow.emit(i);
  }

  previousStep() {
    this.previous.emit(null);
  }

  deleteDocument(document: DocumentItem) {
    this.remove.emit(document);
  }

  onCancel() {
    this.cancel.emit()
  }

  commentArrayisValid(i: number) {
    return (this.formsContributor.get('contributors') as FormArray).controls[i].get('appealReason');
  }

  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
}
