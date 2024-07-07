import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WizardItem, bindToObject, GosiCalendar } from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import {
  AnnuityResponseDto,
  TableHeadingAndParamName,
  showErrorMessage,
  SearchPerson,
  BenefitRecalculation,
  AnnuityBenefitRequest,
  PatchPersonBankDetails,
  BenefitConstants
} from '../../../../shared';
import { DependentBaseComponent } from '../../../../annuity/base/dependent.base-component';

@Component({
  selector: 'bnt-benefit-type-modify-sc',
  templateUrl: './benefit-type-modify-sc.component.html',
  styleUrls: ['./benefit-type-modify-sc.component.scss']
})
export class BenefitTypeModifyScComponent extends DependentBaseComponent implements OnInit {
  @ViewChild('applyBenefitWizard', { static: false })
  applyBenefitWizard: ProgressWizardDcComponent;
  benefitId;
  iban: string;
  identifier;
  benefitRecalculationDetails: BenefitRecalculation;
  benefitType: string;
  benefitWizards: WizardItem[] = [];
  currentBenefits: AnnuityResponseDto;
  currentTab = 0;
  documentForm: FormGroup;
  pensionTransactionId = BenefitConstants.TRANSACTIONID_PENSION;
  tableHeadingAndParams: TableHeadingAndParamName[] = [
    {
      heading: 'BENEFITS.DEPENDENT-NAME',
      parameterName: 'name'
    },
    {
      heading: 'BENEFITS.NATIONAL-ID',
      parameterName: 'id'
    },
    {
      heading: 'BENEFITS.RELATIONSHIP-WITH-CONTRIBUTOR',
      parameterName: 'relationship'
    },
    {
      heading: 'BENEFITS.AGE-TITLE',
      parameterName: 'age'
    }
  ];

  ngOnInit(): void {
    this.benefitWizards = this.wizardService.getBenefitWizardItems();
    this.benefitWizards[0].isImage = true;
    this.benefitWizards[1].isImage = true;
    this.searchBenefit({
      identifier: this.routerData.idParams.get('socialInsuranceNo'),
      requestId: this.routerData.idParams.get('id')
    });
    this.getStystemParamAndRundate();
    this.initRelationShipLookup();
    this.initHeirStatusLookup();
    this.initMaritalStatusLookup();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
  selectedWizard(event) {}

  initRelationShipLookup() {
    this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipList();
  }
  searchBenefit(benefits) {
    this.identifier = benefits.identifier;
    this.benefitId = benefits.requestId;
    this.manageBenefitService.getBenefitDetails(benefits.identifier, benefits.requestId).subscribe(res => {
      this.currentBenefits = res;
      this.sin = benefits.identifier;
      this.getDependents(benefits.identifier, this.currentBenefits.benefitType.english);
      this.searchPerson(
        {
          ...new SearchPerson(),
          nationality: { arabic: 'السعودية ', english: 'Saudi Arabia' },
          dob: {
            ...bindToObject(new GosiCalendar(), this.currentBenefits.dateOfBirth),
            calendarType: this.currentBenefits.dateOfBirth.entryFormat.toLowerCase()
          },
          identity: [{ idType: 'newNin', newNin: this.currentBenefits.nin, expiryDate: null }]
        },
        this.currentBenefits.benefitStartDate
      );
    });
    this.manageBenefitService.getBenefitRecalculation(this.identifier, this.benefitId).subscribe(res => {
      this.benefitRecalculationDetails = res;
    });
  }
  savePaymentDetails() {
    const benefitRequest = {
      action: 'ADD',
      bankAccount: { ...new PatchPersonBankDetails(), ibanAccountNo: this.iban, bankName: this.bankNameList.value },
      dependents: this.listOfDependents,
      revisedBenefitType: 'Retirement Pension Benefit'
    };
    this.manageBenefitService
      .updateForAnnuityBenefit(this.identifier, this.benefitId, null, {
        ...new AnnuityBenefitRequest(),
        ...benefitRequest
      })
      .subscribe(
        res => {
          this.benefitResponse = res;
          this.benefitDocumentService
            .getReqDocs(this.identifier, this.benefitResponse.benefitRequestId, this.benefitResponse.referenceNo)
            .subscribe(response => {
              if (response.length) {
                this.requiredDocs = response;
                this.nextTab();
              }
            });
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }
  /** Method to save benefit type */
  saveBenefitType(benefitType) {
    this.benefitType = benefitType;
    this.nextTab();
  }
  /** Method to get dependent details */
  getDependents(sin: number, benefitType: string) {
    this.dependentService.getDependentDetails(sin, benefitType, null, null).subscribe(
      response => {
        this.listOfDependents = response;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  /** Method to navigate to next tab */
  nextTab() {
    this.currentTab = this.currentTab + 1;
  }
  /** Method to navigate to previous tab */
  previousTab() {
    this.currentTab = this.currentTab - 1;
  }
  /** Method to get bank name */
  getBankName(bankCode) {
    this.iban = bankCode;
    this.getBank(bankCode.value.slice(4, 6));
  }
  /** Method to submit transaction */
  submitTransaction(comment) {
    this.manageBenefitService
      .patchAnnuityBenefit(
        this.identifier,
        this.benefitResponse.benefitRequestId,
        comment,
        this.benefitResponse.referenceNo
      )
      .subscribe(
        res => {
          if (res.message != null) {
            this.showSuccessMessage(res.message);
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }
  /** Method to cancel transaction */
  cancelModify() {
    this.manageBenefitService.navigateToInbox();
  }
  /** Method to show modal */
  showModal(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalService.show(template, config);
  }
}
