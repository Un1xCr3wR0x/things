import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { InspectionChannel } from '@gosi-ui/features/violations';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  DocumentItem,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  UuidGeneratorService,
  maxDateValidator,
  minDateValidator,
  startOfDay
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppealValidatorRoles } from '../../../../shared/enums/appeal-validator-roles';
import {
  AppealContributors,
  AppealOnViolation
} from '@gosi-ui/features/violations/lib/shared/models/appeal-on-violation';
import { AppealConstants } from '@gosi-ui/features/appeals/lib/shared';
import { TransactionConstants } from '@gosi-ui/features/complaints/lib/shared/constants';
import moment from 'moment';
@Component({
  selector: 'appeal-contributors-details-dc',
  templateUrl: './appeal-contributors-details-dc.component.html',
  styleUrls: ['./appeal-contributors-details-dc.component.scss']
})
export class AppealContributorsDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  contributorDetailsForm: FormArray = new FormArray([]);
  accordionPanel = 1;
  maxCharLength = 350;
  contributorDetail = [];
  lang = 'en';
  channelE_Inspection = InspectionChannel.E_INSPECTION;
  hidden = true;
  isREVIEWER: boolean = false;
  isAPPROVER1: boolean = false;
  isAPPROVER2: boolean = false;
  isAPPROVER3: boolean = false;
  isEXECUTOR: boolean = false;
  showAuditorComments: boolean = true;
  canViewLegalReviewer: boolean = false;
  currentDate = moment().subtract(1, 'days').toDate();
  minStartDate = new Date();
  maxStartDate = new Date();
  docList: DocumentItem[];
  roles = AppealValidatorRoles;

  /**
   * appeal cleric
   */
  sequenceNumber: number;
  uuid: string;
  isScan = false;
  appealDocuments: DocumentItem[] = [];
  transactionRefNumber: number;
  appealTransactionNumber: number;
  uploadResultofObjectionDocuments: DocumentItem[] = [];

  /**
   * Input variables
   */
  @Input() transactionDetails: AppealOnViolation;
  @Input() assigneeIndex: number;
  @Input() referenceNo: number;
  @Input() isReturn: boolean;
  @Input() isSpecialist: boolean = false;
  @Input() validatorType: AppealValidatorRoles;
  @Input() opinionList: LovList;
  @Input() legalOpinionList: Observable<LovList> = new Observable<LovList>();
  @Input() parentForm: FormGroup;
  @Input() docs: DocumentItem[] = [];
  @Input() legalOpinionsList: Lov[];
  @Input() appealSearchList: Lov[];

  booleanList: LovList = {
    items: [
      { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0 },
      { value: { english: 'No', arabic: 'لا' }, sequence: 1 }
    ]
  };

  /** Lookups List For Select  */
  approveOrRejectList: LovList = new LovList([]);
  agreeOrDisagreeList: LovList = new LovList([]);
  processedList: LovList = new LovList([]);

  @Output() submitAppealContributor: EventEmitter<number> = new EventEmitter();

  /**
   * @param fb
   * @param language
   * @param router
   * @param alertService
   */
  constructor(
    readonly fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly uuidGeneratorService: UuidGeneratorService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.getLockups();
    if (this.validatorType === AppealValidatorRoles.IS_REVIEWER_VIOLATION) {
      this.isREVIEWER = true;
    } else if (this.validatorType === AppealValidatorRoles.Legal_Reviewer_Violation) {
      this.isAPPROVER1 = true;
    } else if (this.validatorType === AppealValidatorRoles.Legal_Auditor_Violation) {
      this.isAPPROVER2 = true;
    } else if (this.validatorType === AppealValidatorRoles.Legal_Manger_Violation) {
      this.isAPPROVER3 = true;
    } else if (this.validatorType === AppealValidatorRoles.Executor_Violation) {
      this.isEXECUTOR = true;
    }
  }

  filterDocumentsByContributors() {
    if (!this.transactionDetails || !this.transactionDetails.contributors || !this.docs?.length) {
      return;
    }

    this.transactionDetails.contributors.forEach((contributor, i) => {
      contributor.documents = contributor.contributorDocuments
        .map(docId => this.docs.find(fullDoc => fullDoc.id == docId))
        .filter(Boolean);
    });
  }

  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   * @memberof InputBaseComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionDetails && changes.transactionDetails.currentValue) {
      this.transactionDetails = changes.transactionDetails.currentValue;
      this.contributorDetail = this.transactionDetails?.contributors;
      this.checkIfCanViewLegalReviewer();

      this.transactionDetails?.contributors?.forEach((value, i) => {
        const form = this.createForm(value.contributorId);
        if (form) {
          this.contributorDetailsForm?.push(form);
          this.parentForm.addControl('contributordetails', this.contributorDetailsForm);
          this.fillData(i, value);
        }
      });

      if (this.validatorType === AppealValidatorRoles.Appeal_Clerk_Violation) {
        this.addResultObjectionDocument();
      }
      this.filterDocumentsByContributors();
    }
    if (changes.docs && changes.docs.currentValue) {
      this.filterDocumentsByContributors();
    }
  }
  /** fill object into formgroup control  */
  fillData(index: number, contributor: AppealContributors) {
    if (contributor.reviewerDecision) {
      this.bindReviewerModelToForm(index, contributor);
    }

    if (contributor.legalOpinion) {
      this.bindLegalReviewerModelToForm(index, contributor);
    }
    if (contributor.auditorDecision != null) {
      this.bindLegalAuditorModelToForm(index, contributor);
    }

    if (!contributor.finalLegalOpinion || contributor.legalOpinion) {
      this.bindLegalReviewerModelToLegalMangerForm(index, contributor);
    }
    if (contributor.finalLegalOpinion) {
      this.bindLegalMangerModelToForm(index, contributor);
    }
    if (contributor.summary) {
      this.contributorDetailsForm?.controls[index]?.patchValue({
        summary: contributor.summary
      });
    }

    if (contributor.finalDecision) {
      this.bindAppealClerkModelToForm(index, contributor);
    }
  }

  /**
   * Method to open the owner accordion
   * @param openEvent
   * @param tabIndex
   */
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }

  /**Method to save */
  submitCotrinutorForm(i: number) {
    this.contributorDetailsForm?.controls[i]?.markAllAsTouched();
    this.contributorDetailsForm?.controls[i]?.updateValueAndValidity();
    if (this.contributorDetailsForm?.controls[i]?.valid) {
      this.transactionDetails.contributors[i].showMandatoryError = false;
      this.submitAppealContributor.emit(i);
      this.accordionPanel = -1;
    } else {
      this.transactionDetails.contributors[i].showMandatoryError = true;
      const element = document.getElementById(String(i));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }

  onChangeAppealOpinion(value: Lov) {}
  onChangeLegalOpinion(value: Lov) {}

  setValid(i, value) {
    var name = this.validatorType === AppealValidatorRoles.AOV_APPROVER_2 ? 'notes' : 'notes';
    if (value === 'No') {
      this.contributorDetailsForm.controls[i]?.get('notes').setValidators(Validators.required);
    } else {
      this.contributorDetailsForm.controls[i]?.get('notes').clearValidators();
    }
    this.contributorDetailsForm.controls[i]?.get('notes').updateValueAndValidity();
  }

  setAgree(i, value) {
    if (value === 'No') {
      this.contributorDetailsForm.controls[i]?.get('opinionReviewNotes').setValidators(Validators.required);
      this.hidden = false;
    } else {
      this.contributorDetailsForm.controls[i]?.get('opinionReviewNotes').clearValidators();
      this.hidden = true;
    }
    this.contributorDetailsForm.controls[i]?.get('opinionReviewNotes').updateValueAndValidity();
  }

  createForm(contributorId: number) {
    const contributor: AppealContributors = this.transactionDetails?.contributors?.find(
      cont => cont.contributorId == contributorId
    );
    if (this.validatorType === AppealValidatorRoles.IS_REVIEWER_VIOLATION) {
      return this.createReviewerForm(contributorId);
    } else if (this.validatorType === AppealValidatorRoles.Legal_Reviewer_Violation) {
      return this.createApprover1Form(contributorId);
    } else if (this.validatorType === AppealValidatorRoles.Legal_Auditor_Violation) {
      return this.createApprover2Form(contributorId);
    } else if (this.validatorType === AppealValidatorRoles.Legal_Manger_Violation) {
      return this.createApprover3Form(contributorId);
    } else if (this.validatorType === AppealValidatorRoles.Executor_Violation) {
      return this.createExecutorForm(contributorId);
    } else if (
      this.validatorType === AppealValidatorRoles.Appeal_Clerk_Violation ||
      this.validatorType === AppealValidatorRoles.Committee_secretary_violation ||
      contributor.finalDecision
    ) {
      return this.createAppealClerkForm(contributorId);
    } else if (this.validatorType === AppealValidatorRoles.Preparation_Team_Violation) {
      return this.createPreparationTeamForm(contributorId);
    } else if (
      this.validatorType === AppealValidatorRoles.Establishments_specialist_violation ||
      this.validatorType === AppealValidatorRoles.OH_and_pensions_specialist_violation ||
      this.validatorType === AppealValidatorRoles.Individuals_Preparation_Specialist_Violation ||
      this.validatorType === AppealValidatorRoles.Private_Collection_Specialist_Violation
    ) {
      return this.createSpecialistForm(contributorId);
    }
  }

  /***
   *
   * New Methods
   */
  createReviewerForm(contributorId: number) {
    return this.fb.group({
      contributorId: contributorId,
      reviewerIsAcceptedFormally: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      reviewerComments: ['', Validators.required],
      reviewerIsAcceptedObjectively: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      reviewerObjectionComments: ['', Validators.required],
      reviewerDecision: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
    });
  }

  // legal reviewer
  createApprover1Form(contributorId: number) {
    return this.fb.group({
      ...this.createReviewerForm(contributorId).controls,
      opinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      opinionComments: ['', Validators.required],
      legalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      legalOpinionComments: ['', Validators.required]
    });
  }

  // legal auditor
  createApprover2Form(contributorId: number) {
    return this.fb.group({
      ...this.createApprover1Form(contributorId).controls,
      auditorDecision: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      auditorComments: ['']
    });
  }
  // legal Manger
  createApprover3Form(contributorId: number) {
    return this.fb.group({
      ...this.createApprover2Form(contributorId).controls,
      finalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalOpinionComments: ['', Validators.required],
      finalLegalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalLegalOpinionComments: ['', Validators.required]
    });
  }
  // excitor
  createExecutorForm(contributorId: number) {
    const contributor: AppealContributors = this.transactionDetails?.contributors?.find(
      cont => cont.contributorId == contributorId
    );
    if (contributor.finalDecision) {
      return this.fb.group({
        ...this.createAppealClerkForm(contributorId).controls,
        executorDecision: this.fb.group({
          english: ['Approve'],
          arabic: []
        }),
        executorComments: ['', Validators.required]
      });
    } else if (contributor.auditorDecision != null)
      return this.fb.group({
        ...this.createApprover3Form(contributorId).controls,
        executorDecision: this.fb.group({
          english: ['Approve'],
          arabic: []
        }),
        executorComments: ['', Validators.required]
      });
    else {
      return this.fb.group({
        ...this.createReviewerForm(contributorId).controls,
        executorDecision: this.fb.group({
          english: ['Approve'],
          arabic: []
        }),
        executorComments: ['', Validators.required]
      });
    }
  }

  // Specialist
  createSpecialistForm(contributorId: number) {
    const contributor: AppealContributors | undefined = this.transactionDetails?.contributors?.find(
      cont => cont.contributorId === contributorId
    );

    //legal Manger
    if (contributor?.finalLegalOpinion) {
      return this.fb.group({ ...this.createApprover3Form(contributorId).controls });
    }
    //auditor
    else if (contributor?.auditorDecision != null) {
      const auditor = this.createApprover2Form(contributorId).controls;
      return this.fb.group({ ...auditor });
    }
    // legalReviewer
    else if (contributor?.legalOpinion) {
      const legalReviewer = this.createApprover1Form(contributorId).controls;
      return this.fb.group({ ...legalReviewer });
    }
    // isReviewer
    else if (contributor?.reviewerDecision) {
      const reviewerFormControls = this.createReviewerForm(contributorId).controls;
      return this.fb.group({ ...reviewerFormControls });
    }
  }

  //  Preparation Team Form
  createPreparationTeamForm(contributorId: number) {
    const contributor: AppealContributors = this.transactionDetails?.contributors?.find(
      cont => cont.contributorId == contributorId
    );

    if (contributor.auditorDecision != null)
      return this.fb.group({
        ...this.createApprover3Form(contributorId).controls,
        summary: ['', Validators.required]
      });
    else {
      return this.fb.group({
        ...this.createReviewerForm(contributorId).controls,
        summary: ['', Validators.required]
      });
    }
  }

  //  AppealClerkForm

  minEndDate = new Date();
  maxEndDate = new Date();
  createAppealClerkForm(contributorId: number) {
    this.maxEndDate = moment().subtract(1, 'days').toDate();

    this.uuid = this.uuidGeneratorService.getUuid();

    return this.fb.group({
      ...this.createPreparationTeamForm(contributorId).controls,
      finalDecision: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),

      finalDecisionDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([maxDateValidator(this.maxEndDate)]),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      finalDecisionComments: ['', Validators.required],
      fileResultOfObjection: []
    });
  }

  getLockups(): void {
    this.approveOrRejectList = new LovList(AppealConstants.APPROVE_REJECT);
    this.agreeOrDisagreeList = new LovList(AppealConstants.AGREE_DISAGREE);
    this.processedList = new LovList(AppealConstants.PROCESSED_LIST);
  }

  bindReviewerModelToForm(index: number, contributor: AppealContributors) {
    const REVIEWER_DECISION = this.legalOpinionsList.find(
      i => i.value.english === contributor.reviewerDecision.english
    );
    this.contributorDetailsForm?.controls[index]?.patchValue({
      reviewerIsAcceptedFormally: {
        english: contributor.reviewerIsAcceptedFormally ? 'Approve' : 'Reject'
      },
      reviewerComments: contributor.reviewerComments,
      reviewerIsAcceptedObjectively: {
        english: contributor.reviewerIsAcceptedObjectively ? 'Approve' : 'Reject'
      },
      reviewerObjectionComments: contributor.reviewerObjectionComments,
      reviewerDecision: {
        english: REVIEWER_DECISION.code
      }
    });
    this.transactionDetails.contributors[index].isSaved = true;
    // this.contributorDetailsForm?.controls[index]?.disable();
  }

  bindLegalReviewerModelToForm(index: number, contributor: AppealContributors) {
    const OPINION = this.appealSearchList.find(i => i.value.english === contributor.opinion?.english);
    const LEGAL_OPINION = this.legalOpinionsList.find(i => i.value.english === contributor.legalOpinion?.english);

    this.contributorDetailsForm?.controls[index]?.patchValue({
      opinion: {
        english: OPINION?.code
      },
      opinionComments: contributor.opinionComments,
      legalOpinion: {
        english: LEGAL_OPINION?.code
      },
      legalOpinionComments: contributor.legalOpinionComments
    });
  }

  bindLegalAuditorModelToForm(index: number, contributor: AppealContributors) {
    this.contributorDetailsForm?.controls[index]?.patchValue({
      auditorDecision: {
        english: this.getAuditorDecision(contributor.auditorDecision, index)
      },
      auditorComments: contributor.auditorComments
    });
  }
  // Get Decision Value and Bind to Radio Button
  getAuditorDecision(value: boolean, index: number): string {
    if (value) {
      this.transactionDetails.contributors[index].showAuditorComments = false;
      return 'Approve';
    } else {
      this.transactionDetails.contributors[index].showAuditorComments = true;
      return 'Reject';
    }
  }

  bindLegalMangerModelToForm(index: number, contributor: AppealContributors) {
    const OPINION = this.appealSearchList.find(i => i.value.english === contributor?.finalOpinion?.english);
    const LEGAL_OPINION = this.legalOpinionsList.find(i => i.value.english === contributor?.finalLegalOpinion?.english);
    this.contributorDetailsForm?.controls[index]?.patchValue({
      finalOpinion: {
        english: OPINION?.code
      },
      finalOpinionComments: contributor.finalOpinionComments,
      finalLegalOpinion: {
        english: LEGAL_OPINION?.code
      },
      finalLegalOpinionComments: contributor.finalLegalOpinionComments
    });
  }

  bindLegalReviewerModelToLegalMangerForm(index: number, contributor: AppealContributors): void {
    const OPINION = this.appealSearchList.find(i => i.value.english === contributor.opinion?.english);
    const LEGAL_OPINION = this.legalOpinionsList.find(i => i.value.english === contributor.legalOpinion?.english);
    this.contributorDetailsForm?.controls[index]?.patchValue({
      finalOpinion: {
        english: OPINION?.code
      },
      finalOpinionComments: contributor.opinionComments,
      finalLegalOpinion: {
        english: LEGAL_OPINION?.code
      },
      finalLegalOpinionComments: contributor.legalOpinionComments
    });
  }

  bindAppealClerkModelToForm(index: number, contributor: AppealContributors): void {
    const FINAL_DECISION = this.legalOpinionsList.find(i => i.value.english === contributor.finalDecision?.english);
    this.contributorDetailsForm?.controls[index]?.patchValue({
      finalDecision: {
        english: FINAL_DECISION.code
      },
      finalDecisionDate: {
        gregorian: contributor.finalDecisionDate,
        hijiri: ''
      },
      finalDecisionComments: contributor.finalDecisionComments
    });
  }

  checkIfCanViewLegalReviewer() {
    const includedRoles: AppealValidatorRoles[] = [AppealValidatorRoles.Legal_Reviewer_Violation];
    const excludeRoles: AppealValidatorRoles[] = [
      AppealValidatorRoles.IS_REVIEWER_VIOLATION,
      AppealValidatorRoles.Legal_Reviewer_Violation,
      AppealValidatorRoles.Legal_Manger_Violation
    ];
    if (
      includedRoles.includes(this.validatorType) ||
      (!excludeRoles.includes(this.validatorType) &&
        !this.transactionDetails.contributors[0]?.finalLegalOpinion &&
        this.transactionDetails.contributors[0]?.legalOpinion)
    ) {
      this.canViewLegalReviewer = true;
    } else {
      this.canViewLegalReviewer = false;
    }
  }

  onAuditorDecisionChanged(state: any, i: number) {
    if (state === 'Reject') {
      this.transactionDetails.contributors[i].showAuditorComments = true;
      this.contributorDetailsForm?.controls[i]?.get('auditorComments').setValidators([Validators.required]);
    } else {
      this.transactionDetails.contributors[i].showAuditorComments = false;
      this.contributorDetailsForm?.controls[i]?.get('auditorComments').clearValidators();
      this.contributorDetailsForm?.controls[i]?.get('auditorComments').updateValueAndValidity();
    }
    this.contributorDetailsForm?.controls[i]?.updateValueAndValidity();
  }

  /***
   * to be handled !
   */

  addResultObjectionDocument(): void {
    const documentDetails = TransactionConstants.APPEAL_DOCUMENT_DETAILS.find(item => item.actionName == 'canAppeal');

    this.sequenceNumber = this.uploadResultofObjectionDocuments?.length + 1;
    const documentItem = new DocumentItem();
    documentItem.uuid = this.uuid;
    documentItem.sequenceNumber = this.sequenceNumber;
    documentItem.fileName = 'Appeal - Result of Objection';
    documentItem.transactionId = documentDetails.transactionId.toString();
    documentItem.documentTypeId = 2519;
    documentItem.name = { arabic: '', english: 'Appeal - Result of Objection' };
    documentItem.required = true;
    documentItem.showBusinessKey = true;
    documentItem.businessKey = this.transactionDetails.appealId;
    this.uploadResultofObjectionDocuments.push(documentItem);
  }
}
