import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DocumentItem} from "@gosi-ui/core";
import {ContributorDetail} from "@gosi-ui/features/violations/lib/shared/models/contributor-detail";
import {FormArray, FormGroup} from "@angular/forms";

@Component({
  selector: 'vol-contributor-list-dc',
  templateUrl: './contributor-list-dc.component.html',
  styleUrls: ['./contributor-list-dc.component.scss']
})
export class ContributorListDcComponent {
  @Input() contributorList: ContributorDetail[] = [];
  accordionPanel: number;
  @Output() submitForm: EventEmitter<ContributorDetail[]> = new EventEmitter();
  @Input() referenceNo: number; // transactiontraceid
  @Input() transactionId: string;
  @Input() appealId: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Input() canEdit = true;
  @Input() canUserModified: boolean;
  @Output() docInfo: EventEmitter<{ doc: DocumentItem, contributorId: number }> = new EventEmitter();
  @Input() formContributors: FormGroup;


  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }

  get contributorFormArray() {
    return this.formContributors.get('contributors') as FormArray;
  }

  onSubmit() {
    this.submitForm.emit(this.contributorList);
  }
}
