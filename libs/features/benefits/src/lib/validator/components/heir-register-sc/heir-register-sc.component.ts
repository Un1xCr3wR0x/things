import { Component, OnInit, TemplateRef } from '@angular/core';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import {
  UITransactionType,
  HeirAccountDetails,
  PersonalInformation,
  BenefitValues,
  createDetailForm,
  createModalForm,
  getIdLabel,
  getIdRemoveNullValue, BenefitConstants, UIPayloadKeyEnum
} from '../../../shared';
import moment from 'moment';
import {
  BPMUpdateRequest,
  GosiCalendar,
  RouterConstants,
  CommonIdentity,
  WorkFlowActions,
  formatDate
} from '@gosi-ui/core';

@Component({
  selector: 'bnt-heir-register-sc',
  templateUrl: './heir-register-sc.component.html',
  styleUrls: ['./heir-register-sc.component.scss']
})
export class HeirRegisterScComponent extends ValidatorBaseScComponent implements OnInit {
  heirAccountDetails: HeirAccountDetails;
  heirPersonDetails: PersonalInformation;
  contributorPersonDetails: PersonalInformation;
  heirAge: number;
  heirDob: string;
  isDeath: boolean;
  contributorAge: number;
  contributorDob: string;
  heirNameEnglish: string;
  heirNameArabic: string;
  contributorNameEnglish: string;
  contributorNameArabic: string;
  reasonForBenefit: string;
  heirNin: string;
  heirNinLabel: string;
  contributorNinLabel: string;
  contributorNin: string;
  isTransactionsView: boolean;
  ngOnInit(): void {
    this.retirementForm = createDetailForm(this.fb);
    this.retirementModal = createModalForm(this.fb);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    if (this.router.url.includes('transactions'))
    {
      const transaction = this.transactionService.getTransactionDetails();
      this.socialInsuranceNo = transaction.idParams.get('NIN');
      this.requestId = transaction.idParams.get('HEIR_ACCOUNT_ID');
      this.isTransactionsView = true;
    } else {
      this.intialiseTheView(this.routerData);
    }
    this.getRejectionReason(this.retirementForm);
    this.fetchDocuments();
    this.getHeirAccountDetails(this.socialInsuranceNo);
  }

  fetchDocuments() {
    this.transactionKey = UITransactionType.REQUEST_HEIR_ACCOUNT;
    this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    this.benefitDocumentService
      .getUploadedDocuments(this.requestId, this.transactionKey, this.transactionType)
      .subscribe(res => {
        this.documentList = res;
      });
  }

  /** Method to fetch heir account details*/
  getHeirAccountDetails(id: number) {
    this.heirBenefitService.getAccountRequestDetails(id, this.requestId).subscribe(res => {
      this.heirAccountDetails = res;
      if (
        this.heirAccountDetails.benefitRequestReason.english === BenefitValues.deathOfTheContributor ||
        this.heirAccountDetails.benefitRequestReason.english === BenefitValues.ohDeathOfTheContributor
      ) {
        this.isDeath = true;
      } else {
        this.isDeath = false;
      }
      if (this.heirAccountDetails && this.heirAccountDetails.heirPersonId) {
        this.getHeirPersonDetails();
      }
      if (this.heirAccountDetails && this.heirAccountDetails.contributorPersonId) {
        this.getContributorPersonDetails();
      }
    });
  }
  /** to get the heir person details */
  getHeirPersonDetails() {
    this.manageBenefitService
      .getPersonDetailsWithPersonId(this.heirAccountDetails.heirPersonId?.toString())
      .subscribe(res => {
        this.heirPersonDetails = res;
        this.getHeirAgeDateOfBirthValues();
        this.heirNameEnglish = this.heirPersonDetails.name.english.name;
        this.heirNameArabic =
          this.heirPersonDetails.name.arabic?.firstName +
          ' ' +
          this.heirPersonDetails.name.arabic?.secondName +
          ' ' +
          this.heirPersonDetails.name.arabic?.thirdName +
          ' ' +
          this.heirPersonDetails.name.arabic?.familyName;

        const idObj: CommonIdentity | null = this.heirPersonDetails.identity.length
          ? getIdRemoveNullValue(this.heirPersonDetails.identity)
          : null;
        if (idObj) {
          this.heirNin = idObj.id.toString();
          this.heirNinLabel = getIdLabel(idObj);
        }
      });
  }
  /** to get the contributor person details */
  getContributorPersonDetails() {
    this.manageBenefitService
      .getPersonDetailsWithPersonId(this.heirAccountDetails.contributorPersonId.toString())
      .subscribe(res => {
        this.contributorPersonDetails = res;
        this.getContributorAgeDateOfBirthValues();
        this.contributorNameEnglish = this.contributorPersonDetails.name.english.name;
        this.contributorNameArabic =
          this.contributorPersonDetails.name.arabic?.firstName +
          ' ' +
          this.contributorPersonDetails.name.arabic?.secondName +
          ' ' +
          this.contributorPersonDetails.name.arabic?.thirdName +
          ' ' +
          this.contributorPersonDetails.name.arabic?.familyName;
        if (this.contributorPersonDetails?.deathDate) {
          this.reasonForBenefit = BenefitValues.deathOfTheContributor;
        } else {
          this.reasonForBenefit = BenefitValues.missingContributor;
        }
        const idObj: CommonIdentity | null = this.contributorPersonDetails.identity.length
          ? getIdRemoveNullValue(this.contributorPersonDetails.identity)
          : null;
        if (idObj) {
          this.contributorNin = idObj.id.toString();
          this.contributorNinLabel = getIdLabel(idObj);
        }
      });
  }
  getHeirAgeDateOfBirthValues() {
    this.heirAge = this.ageFromDateOfBirthday(this.heirPersonDetails.birthDate);
    if (this.heirPersonDetails.birthDate.gregorian) {
      const momentObj = moment(this.heirPersonDetails.birthDate.gregorian, 'YYYY-MM-DD');
      const momentString = momentObj.format('DD/MM/YYYY');
      this.heirDob = momentString;
    }
  }
  getContributorAgeDateOfBirthValues() {
    this.contributorAge = this.ageFromDateOfBirthday(this.contributorPersonDetails.birthDate);
    if (this.contributorPersonDetails.birthDate.gregorian) {
      const momentObj = moment(this.contributorPersonDetails.birthDate.gregorian, 'YYYY-MM-DD');
      const momentString = momentObj.format('DD/MM/YYYY');
      this.contributorDob = momentString;
    }
  }
  public ageFromDateOfBirthday(dateOfBirth: GosiCalendar) {
    const birthdate = moment(dateOfBirth.gregorian);
    const thisDay = moment();
    const age = thisDay.diff(birthdate, 'years');
    return age;
  }
  navigateToInjuryDetails() {
    this.routerData.stopNavigationToValidator = true;
    this.router.navigate([BenefitConstants.ROUTE_INDIVIDUAL(this.socialInsuranceNo)]);
  }
  // Method to show approve modal  /
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    if (!this.disableApprove) {
      this.showModal(templateRef);
    }
  }
  confirmActivate() {
    this.hideModal();
    const data = this.createWorkflowModel();
    data.outcome = WorkFlowActions.APPROVE;
    this.heirBenefitService.updateTaskWorkflow(data).subscribe(res => {
      if (res) {
        this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_APPROVED');
      }
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    });
  }

  createWorkflowModel() {
    const data = new BPMUpdateRequest();
    data.taskId = this.taskId;
    data.user = this.user;
    data.assignedRole = this.routerData.assignedRole;
    if (this.referenceNo) {
      data.referenceNo = this.referenceNo.toString();
    }

    if (this.retirementForm.get('rejectionReason')) {
      data.rejectionReason = this.retirementForm.get('rejectionReason').value;
    }
    if (this.retirementForm.get('comments')) {
      data.comments = this.retirementForm.get('comments').value;
    }
    if (this.retirementForm.get('returnReason')) {
      data.returnReason = this.retirementForm.get('returnReason').value;
    }
    return data;
  }

  confirmRejectRequest() {
    this.hideModal();
    const data = this.createWorkflowModel();
    data.outcome = WorkFlowActions.REJECT;
    this.heirBenefitService.updateTaskWorkflow(data).subscribe(res => {
      if (res) {
        this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_REJECTED');
      }
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    });
  }
  // Show modal for rejection
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
