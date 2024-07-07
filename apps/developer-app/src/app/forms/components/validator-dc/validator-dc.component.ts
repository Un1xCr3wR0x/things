import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentItem, Establishment, Lov, LovList, TransactionReferenceData } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'dev-validator-dc',
  templateUrl: './validator-dc.component.html',
  styleUrls: ['./validator-dc.component.scss']
})
export class ValidatorDcComponent implements OnInit {
  comments: TransactionReferenceData[] = [];
  documents: DocumentItem[];
  establishment: Establishment;
  validatorForm: FormGroup;
  bsModalRef: BsModalRef;
  transactionNumber: number = 12345;
  lovlist$: Observable<LovList>;

  constructor(readonly fb: FormBuilder, readonly bsModalService: BsModalService) {}

  ngOnInit(): void {
    this.validatorForm = this.createForm();
    this.lovlist$ = this.getLovList();
    this.establishment = {
      ...new Establishment(),
      registrationNo: 100011182,
      name: { arabic: 'سيبسي', english: 'Saudi Aramco' }
    };
    this.comments = [
      {
        transactionType: 'Register Contributor',
        referenceNo: 10276,
        rejectionReason: null,
        comments: 'abcd',
        createdDate: {
          gregorian: null,
          hijiri: '1441-01-17'
        },
        bilingualComments: null,
        role: { arabic: 'فرعية', english: 'Kuwait' },
        userName: { arabic: 'فرعية', english: 'Kuwait' },
        transactionStatus: null
      }
    ];
  }
  editEst() {}

  createForm(): FormGroup {
    return this.fb.group({
      taskId: [null],
      user: [null],
      referenceNo: [null],
      action: [null],
      registrationNo: [null]
    });
  }

  approveTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef, 'lg');
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef, 'lg');
  }

  /**
   * Method to show return modal
   * @param templateRef
   */
  returnTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef, 'lg');
  }
  showModal(template: TemplateRef<HTMLElement>, size: string = 'md', ignoreBackdrop: boolean = false): void {
    if (template) {
      this.bsModalRef = this.bsModalService.show(
        template,
        Object.assign({}, { class: 'modal-' + size, ignoreBackdropClick: ignoreBackdrop })
      );
    }
  }

  hideModal(): void {
    this.bsModalRef?.hide();
  }
  confirmCancel() {
    this.hideModal();
  }
  getLovList(): Observable<LovList> {
    const lovArray: Lov[] = [];
    ['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4', 'Reason 5'].some((itemValue, index) => {
      lovArray.push({
        sequence: index,
        value: { english: itemValue, arabic: itemValue }
      });
    });
    return of(new LovList(lovArray));
  }
}
