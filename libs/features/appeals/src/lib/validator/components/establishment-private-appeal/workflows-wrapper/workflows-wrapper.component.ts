import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, LookupService, Lov, WorkFlowActions, DocumentItem } from '@gosi-ui/core';
import {
  AppealConstants,
  AppealSpecialistRoles,
  AppealValidatorRoles,
  FirstLevelFormService,
  LegalAuditor,
  LegalReviewer,
  Reviewer
} from '@gosi-ui/features/appeals/lib/shared';
import { LegalManager } from '@gosi-ui/features/appeals/lib/shared/models/employees/legal-manager';
import { Subscription } from 'rxjs-compat';
import { AppealClerk } from '@gosi-ui/features/appeals/lib/shared/models/employees/appeal-clerk';

@Component({
  selector: 'appeals-workflows',
  templateUrl: './workflows-wrapper.component.html',
  styleUrls: ['./workflows-wrapper.component.scss']
})
export class AppealsWorkflowsComponent implements OnInit, OnChanges {
  @Input() assignedRole: AppealValidatorRoles;
  @Input() appealDetailNew: any = {};
  @Input() appealDocumentList: any = [];
  @Input() legalOpinion;

  /** Lookups List For DD  */
  approveOrRejectList: LovList = new LovList([]);
  agreeOrDisagreeList: LovList = new LovList([]);
  processedList: LovList = new LovList([]);
  legalOpinionsList: Lov[];
  appealSearchList: Lov[];
  appealDocuments: DocumentItem[] = [];

  isSpecialist: boolean = false;
  canViewLegalReviewer: boolean = false;

  /** Forms */
  specialistForm: FormGroup = this.fb.group({
    comments: ['', Validators.required]
  });
  appealReasonForm: FormGroup = this.fb.group({
    appealReason: []
  });
  preparationForm: FormGroup = this.fb.group({
    summary: ['', Validators.required]
  });

  /* Constants */
  appealValidatorRoles = AppealValidatorRoles;

  /* Appeal Input Field Model according to Roles */
  reviewerModel: Reviewer;
  legalReviewerModel: LegalReviewer;
  legalAuditorModel: LegalAuditor;
  legalManagerModel: LegalManager;
  appealClerkModel: AppealClerk;

  notifyFormSubscription: Subscription;
  maxCharLength = 350;

  /**
   *
   * @param fb
   * @param lookupService
   */
  constructor(
    readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    private formService: FirstLevelFormService
  ) {}

  ngOnInit(): void {
    this.getLockups();
    this.isSpecialist = Object.values(AppealSpecialistRoles).includes(
      this.assignedRole as unknown as AppealSpecialistRoles
    );
    this.setEmitterListener();
    // console.log(this.appealDetailNew);
    this.checkIfCanViewLegalReviewer();
  }

  ngOnChanges() {
    this.appealDocuments = this.appealDocumentList;
    // console.log(this.appealDocumentList);
    // console.log(this.appealDocuments);
    this.mapGetAppealDetails();
  }

  onReviewerSave(data: any): void {}

  getLockups(): void {
    this.approveOrRejectList = new LovList(AppealConstants.APPROVE_REJECT);
    this.agreeOrDisagreeList = new LovList(AppealConstants.AGREE_DISAGREE);
    this.processedList = new LovList(AppealConstants.PROCESSED_LIST);

    this.lookupService.getAppealLegalOpinionList().subscribe(res => {
      this.legalOpinionsList = res;
    });
    this.lookupService.getAppealSearchList().subscribe(res => {
      this.appealSearchList = res;
    });
  }

  mapGetAppealDetails(): void {
    // Bindin Appeal Reason to Appeal Reason Input Field
    this.appealReasonForm?.patchValue({
      appealReason: this.appealDetailNew?.reason
    });
    if (this.appealDetailNew?.summary) {
      this.preparationForm?.patchValue({
        summary: this.appealDetailNew?.summary
      });

      if (
        ![AppealValidatorRoles.Preparation_team_private, AppealValidatorRoles.Preparation_team_public].includes(
          this.assignedRole
        )
      )
        this.preparationForm.disable();
    }

    /*
     * Binding Appeal Detail to Reviewer Model
     */
    const reviewerModel: Reviewer = {
      reviewerIsAcceptedFormally: this.appealDetailNew?.reviewerIsAcceptedFormally,
      reviewerComments: this.appealDetailNew?.reviewerComments,
      reviewerIsAcceptedObjectively: this.appealDetailNew?.reviewerIsAcceptedObjectively,
      reviewerObjectionComments: this.appealDetailNew?.reviewerObjectionComments,
      reviewerDecision: this.appealDetailNew?.reviewerDecision
    };
    this.reviewerModel = reviewerModel;

    /*
     * Binding Appeal Detail to Legal Auditor Model
     */
    const legalReviewerModel: LegalReviewer = {
      opinion: this.appealDetailNew?.opinion,
      opinionComments: this.appealDetailNew?.opinionComments,
      legalOpinion: this.appealDetailNew?.legalOpinion,
      legalOpinionComments: this.appealDetailNew?.legalOpinionComments
    };
    this.legalReviewerModel = legalReviewerModel;

    /*
     * Binding Appeal Detail to Legal Reviewer Model
     */
    const legalAuditorModel: LegalAuditor = {
      auditorDecision: this.appealDetailNew?.auditorDecision,
      auditorComments: this.appealDetailNew?.auditorComments
    };
    this.legalAuditorModel = legalAuditorModel;

    /*
     * Binding Appeal Detail to Legal Manager Model
     */
    const legalManagerModel: LegalManager = {
      finalOpinion: this.appealDetailNew?.finalOpinion,
      finalOpinionComments: this.appealDetailNew?.finalOpinionComments,
      finalLegalOpinion: this.appealDetailNew?.finalLegalOpinion,
      finalLegalOpinionComments: this.appealDetailNew?.finalLegalOpinionComments
    };
    this.legalManagerModel = legalManagerModel;

    /*
     * Binding Appeal Detail to Appeal Clerk Model
     */
    const appealClerkModel: AppealClerk = {
      finalDecision: this.appealDetailNew?.finalDecision,
      finalDecisionDate: this.appealDetailNew?.finalDecisionDate,
      finalDecisionComments: this.appealDetailNew?.finalDecisionComments,
      transactionNumber: this.appealDetailNew?.refNumber,
      appealTransactionNumber: this.appealDetailNew?.transactionRefNumber,
      fileResultOfObjection: null,
      fileMinutesOfMeeting: null,
      appealDocumentList: this.appealDocuments
    };
    this.appealClerkModel = appealClerkModel;
    // console.log(this.appealClerkModel);
  }

  /**
   * this methoud for listen on submitting to emit the form value
   */
  setEmitterListener(): void {
    this.notifyFormSubscription = this.formService.listenOnFormToEmitting().subscribe(res => {
      if (Object.values(AppealSpecialistRoles).includes(res?.type as any)) {
        this.specialistForm.updateValueAndValidity();
        this.specialistForm.markAllAsTouched();
        if (this.specialistForm.valid) {
          this.formService.updateFormValue(this.specialistForm.value, WorkFlowActions.APPROVE);
          this.specialistForm.reset();
        }
      }
      if (
        [AppealValidatorRoles.Preparation_team_private, AppealValidatorRoles.Preparation_team_public].includes(
          res?.type
        )
      ) {
        if (this.preparationForm?.disabled || !this.preparationForm) return;

        this.preparationForm.updateValueAndValidity();
        this.preparationForm.markAllAsTouched();
        if (this.preparationForm.valid) {
          this.formService.updateFormValue(this.preparationForm?.value, WorkFlowActions.APPROVE);
          this.preparationForm.reset();
        }
      }
    });
  }

  checkIfCanViewLegalReviewer() {
    const includedRoles: AppealValidatorRoles[] = [
      AppealValidatorRoles.Legal_reviewer_private,
      AppealValidatorRoles.Legal_reviewer_public
    ];
    const excludeRoles: AppealValidatorRoles[] = [
      AppealValidatorRoles.IS_reviewer_private,
      AppealValidatorRoles.IS_reviewer_public,
      AppealValidatorRoles.Legal_reviewer_private,
      AppealValidatorRoles.Legal_reviewer_public,
      AppealValidatorRoles.Legal_manager_private,
      AppealValidatorRoles.Legal_manager_public,
      ...this.allAppealValidatorRolesNumber()
    ];
    if (
      includedRoles.includes(this.assignedRole) ||
      (!excludeRoles.includes(this.assignedRole) &&
        !this.legalManagerModel.finalLegalOpinion &&
        this.legalReviewerModel.legalOpinion)
    ) {
      this.canViewLegalReviewer = true;
    } else {
      this.canViewLegalReviewer = false;
    }
  }

  allAppealValidatorRolesNumber() {
    return Object.values(AppealSpecialistRoles) as unknown as AppealValidatorRoles[];
  }
}
