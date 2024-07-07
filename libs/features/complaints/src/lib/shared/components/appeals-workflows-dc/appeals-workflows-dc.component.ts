import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService, Lov, LovList } from '@gosi-ui/core';
import { AppealConstants, AppealSpecialistRoles, AppealValidatorRoles } from '@gosi-ui/features/appeals/lib/shared';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'gosi-ui-appeals-workflows-dc',
  templateUrl: './appeals-workflows-dc.component.html',
  styleUrls: ['./appeals-workflows-dc.component.scss']
})
export class AppealsWorkflowsDcComponent implements OnInit {
  @Input() assignedRole: AppealValidatorRoles;
  @Input() data: any = {};

  appealValidatorRoles = AppealValidatorRoles;
  form: FormGroup;
  loadingData: boolean = true;
  canViewLegalReviewer: boolean = false;

  /** Lookups List For DD  */
  approveOrRejectList: LovList = new LovList([]);
  agreeOrDisagreeList: LovList = new LovList([]);
  processedList: LovList = new LovList([]);
  legalOpinionsList: Lov[];
  appealSearchList: Lov[];

  constructor(readonly fb: FormBuilder, readonly lookupService: LookupService) {}

  ngOnInit(): void {
    this.initForm();
    this.getLockups();
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
      (!excludeRoles.includes(this.assignedRole) && !this.data.finalLegalOpinion && this.data.legalOpinion)
    ) {
      this.canViewLegalReviewer = true;
    } else {
      this.canViewLegalReviewer = false;
    }
  }

  getLockups(): void {
    this.approveOrRejectList = new LovList(AppealConstants.APPROVE_REJECT);
    this.agreeOrDisagreeList = new LovList(AppealConstants.AGREE_DISAGREE);
    this.processedList = new LovList(AppealConstants.PROCESSED_LIST);

    const legalOpinionObservable = this.lookupService.getAppealLegalOpinionList();
    const appealSearchObservable = this.lookupService.getAppealSearchList();

    forkJoin([legalOpinionObservable, appealSearchObservable]).subscribe(
      ([legalOpinions, appealSearch]) => {
        this.legalOpinionsList = legalOpinions;
        this.appealSearchList = appealSearch;
        this.checkIfCanViewLegalReviewer();
        this.bindData();
        this.loadingData = false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.loadingData = false;
      }
    );
  }

  initForm(): void {
    this.form = this.fb.group({
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
      }),
      opinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      opinionComments: ['', Validators.required],
      legalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      legalOpinionComments: ['', Validators.required],
      auditorDecision: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      auditorComments: [''],
      finalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalOpinionComments: ['', Validators.required],
      finalLegalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalLegalOpinionComments: ['', Validators.required],

      // executor
      executorDecision: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      // preparation
      executorComments: ['', Validators.required],

      summary: ['', Validators.required],
      // Clerk
      finalDecision: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalDecisionDate: this.fb.group({
        gregorian: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      finalDecisionComments: ['', Validators.required]
    });
  }

  bindData(): void {
    const REVIEWER_DECISION = this.legalOpinionsList.find(i => i.value.english === this.data.reviewerDecision.english);
    this.form?.patchValue({
      reviewerIsAcceptedFormally: {
        english: this.data.reviewerIsAcceptedFormally ? 'Approve' : 'Reject'
      },
      reviewerComments: this.data.reviewerComments,
      reviewerIsAcceptedObjectively: {
        english: this.data.reviewerIsAcceptedObjectively ? 'Approve' : 'Reject'
      },
      reviewerObjectionComments: this.data.reviewerObjectionComments,
      reviewerDecision: {
        english: REVIEWER_DECISION.code
      }
    });

    const OPINION = this.appealSearchList.find(i => i.value.english === this.data.opinion?.english);
    const LEGAL_OPINION = this.legalOpinionsList.find(i => i.value.english === this.data.legalOpinion?.english);
    this.form.patchValue({
      opinion: {
        english: OPINION?.code
      },
      opinionComments: this.data.opinionComments,
      legalOpinion: {
        english: LEGAL_OPINION?.code
      },
      legalOpinionComments: this.data.legalOpinionComments
    });

    this.form.patchValue({
      auditorDecision: {
        english: this.data.auditorDecision ? 'Approve' : 'Reject'
      },
      auditorComments: this.data.auditorComments
    });

    const FINAL_OPINION = this.appealSearchList.find(i => i.value.english === this.data.finalOpinion?.english);
    const FINAL_LEGAL_OPINION = this.legalOpinionsList.find(
      i => i.value.english === this.data.finalLegalOpinion?.english
    );
    this.form.patchValue({
      finalOpinion: {
        english: FINAL_OPINION?.code
      },
      finalOpinionComments: this.data.finalOpinionComments,
      finalLegalOpinion: {
        english: FINAL_LEGAL_OPINION?.code
      },
      finalLegalOpinionComments: this.data.finalLegalOpinionComments
    });

    this.form.patchValue({
      executorDecision: {
        english: this.data.executorDecision ? ['Approve'] : ['Reject']
      },
      executorComments: this.data.executorComments
    });

    this.form.disable();
  }

  allAppealValidatorRolesNumber() {
    return Object.values(AppealSpecialistRoles) as unknown as AppealValidatorRoles[];
  }
}
