import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarTypeEnum, convertToStringDDMMYYYY, scrollToTop } from '@gosi-ui/core';
import {
  AlertService,
  DocumentService,
  InspectionService,
  LookupService,
  TransactionService,
  WorkflowService
} from '@gosi-ui/core/lib/services';
import { Contributor } from '@gosi-ui/features/contributor/lib/shared';
import { DocumentTransactionId, DocumentTransactionType } from '@gosi-ui/features/contributor/lib/shared/enums';
import { SaveEngagementPayload } from '@gosi-ui/features/contributor/lib/shared/models/e-inspection-saveEngagement';
import { BsModalService } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs/operators';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared/services';
import { TransactionBaseScComponent } from '../../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-e-registration-sc',
  templateUrl: './e-registration-sc.component.html',
  styleUrls: ['./e-registration-sc.component.scss']
})
export class ERegistrationScComponent extends TransactionBaseScComponent implements OnInit {
  engDetailsCsr: SaveEngagementPayload;
  joiningDate: any;
  leavingDate: string;
  isCsr: any;
  status: string;
  isActive: boolean;
  engagementStatus: string;
  identifier: number;
  requestId: number;
  gosiRegistrationNumber: number;
  personNin = [];
  isppaEstablishment: boolean;

  @Input() badge: string = null;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly inspectionService: InspectionService,
    readonly manageWageService: ManageWageService,
    readonly workflowService: WorkflowService,
    readonly engagementService: EngagementService,
    readonly contractService: ContractAuthenticationService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly transactionService: TransactionService
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }

  ngOnInit(): void {
    super.getTransactionDetails();
    this.contributor = new Contributor();
    this.getPersonDetails(this.nin);
  }

  /** Method to get personel details. */
  getPersonDetails(nin) {
    const queryParams: string = `NIN=${nin}`;
    this.contributorService
      .getPersonDetails(queryParams, new Map().set('fetchAddressFromWasel', true))
      .pipe(
        tap(res => {
          this.contributor.person = res;
          this.age = res.ageInHijiri;
          this.personNin[0] = res.identity[0];
        })
      )
      .subscribe({
        error: err => this.showError(err)
      });
    this.getDataForView();
  }

  // Method to show error message.
  showError(error) {
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }
  /**Method to get engagement details */
  getDataForView() {
    this.contributorService.getEinspectionEngagementDetails(this.NIN, this.RequestId).subscribe(
      res => {
        this.engDetailsCsr = res;
        //console.log('data', this.engDetailsCsr);
        this.isPPA = this.isppaEstablishment = this.engDetailsCsr?.ppaEstablishment;
        if (this.engDetailsCsr?.engagementRequestDto?.joiningDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
          this.joiningDate = convertToStringDDMMYYYY(
            this.engDetailsCsr?.engagementRequestDto?.joiningDate?.gregorian?.toString()
          );
        } else {
          this.joiningDate = convertToStringDDMMYYYY(
            this.engDetailsCsr?.engagementRequestDto?.joiningDate?.hijiri?.toString()
          );
        }
        if (this.engDetailsCsr?.engagementRequestDto?.leavingDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
          this.leavingDate = convertToStringDDMMYYYY(
            this.engDetailsCsr?.engagementRequestDto?.leavingDate?.gregorian?.toString()
          );
        } else {
          this.leavingDate = convertToStringDDMMYYYY(
            this.engDetailsCsr?.engagementRequestDto?.leavingDate?.hijiri?.toString()
          );
        }
        if (!this.isCsr && this.engDetailsCsr?.establishmentStatus) this.status = 'CONTRIBUTOR.ACTIVE';
        else if (!this.isCsr) this.status = 'CONTRIBUTOR.INACTIVE';

        this.isActive = this.engDetailsCsr?.engagementRequestDto?.isActive;
        if (this.isActive) {
          this.engagementStatus = 'CONTRIBUTOR.ACTIVE';
        } else {
          this.engagementStatus = 'CONTRIBUTOR.INACTIVE';
        }
        this.isPPA ? this.getAllDocs(this.referenceNo) : this.getDocument();
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }
  getAllDocs(referenceNo: number) {
    this.documentService.getAllDocuments(null, referenceNo).subscribe(res => {
      this.documents = res.filter(item => item.documentContent !== null);
    });
  }

  /** Method to get documents. */
  getDocument() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
        this.isppaEstablishment
          ? [
              DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION_PPA,
              DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_REJECT
            ]
          : DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION,
        this.RequestId
      )
      .subscribe(res => (this.documents = res.filter(item => item.documentContent !== null)));
  }
}
