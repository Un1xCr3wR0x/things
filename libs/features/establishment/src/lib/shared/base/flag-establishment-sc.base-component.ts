import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  AppConstants,
  DocumentItem,
  DocumentService,
  Lov,
  LovList,
  TransactionFeedback,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { DocumentTransactionIdEnum, DocumentTransactionTypeEnum } from '../enums';
import { Establishment, FlagDetails } from '../models';
import { ChangeEstablishmentService, EstablishmentService } from '../services';
import { activateWizard, getChangeFlagWizards } from '../utils';
import { ChangeEstablishmentScBaseComponent } from './change-establishment-sc.base-component';
export abstract class FlagEstablishmentBaseScComponent extends ChangeEstablishmentScBaseComponent {
  /**
   * Local Variables
   */
  flagWizards: WizardItem[];
  currentTab = 0;
  flagForm: FormGroup;
  flagTypeList: LovList;
  flagReasonList: Lov[] = [];
  justificationLength = 100;
  commentsMaxLength = AppConstants.MAXLENGTH_COMMENTS;
  isValidator = false;
  transactionFeedback: TransactionFeedback;
  flagDocuments: DocumentItem[];
  documentTransactionType = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
  documentTransactionKey = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
  documentTransactionId = DocumentTransactionIdEnum.FLAG_ESTABLISHMENT;
  documents$: Observable<DocumentItem[]>;
  registrationNo: number;
  establishment: Establishment;
  flagDetails: FlagDetails[];
  currentDate: Date = new Date();
  flags: FlagDetails;
  referenceNo: number;

  constructor(
    readonly fb: FormBuilder,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly workflowService: WorkflowService,
    readonly location: Location
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
  }
  /**
   * Method to initialise current tab
   * @param currentTab
   */
  initialiseTabWizards(currentTab: number) {
    this.flagWizards = getChangeFlagWizards(currentTab);
  }
  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number, restrictNextWizards: boolean = false) {
    this.currentTab = tabIndex;
    this.flagWizards = activateWizard(this.flagWizards, tabIndex, restrictNextWizards);
  }

  /**
   * method to create add flag form
   */
  createAddFlagForm() {
    return this.fb.group({
      flagType: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        hijiri: null
      }),
      endDate: this.fb.group({
        gregorian: [null, { updateOn: 'blur' }],
        hijiri: null
      }),
      flagReason: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      justification: [
        '',
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      comments: '',
      referenceNo: undefined
    });
  }

  /**
   * Method to bind values on Re enter
   * @param form
   * @param data
   */
  bindObjectToForm(form: FormGroup, data: FlagDetails) {
    form.updateValueAndValidity();
    form.markAsPristine();
    if (data) {
      Object.keys(data).forEach(name => {
        if (
          name === 'startDate' ||
          (name === 'endDate' && data[name] && form.get(name) && form.get(name).get('gregorian'))
        ) {
          form.get(name).get('gregorian').patchValue(new Date(data[name]['gregorian']));
        } else if (data[name] && form.get(name)) {
          form.get(name).patchValue(data[name]);
          form.get(name).enable();
        }
      });
    }
  }
}
