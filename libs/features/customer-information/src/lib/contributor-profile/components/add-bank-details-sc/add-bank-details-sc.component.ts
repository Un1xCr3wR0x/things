import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  WizardItem,
  AlertService,
  ApplicationTypeToken,
  LookupService,
  LanguageToken,
  DocumentService,
  bindToObject,
  Lov
} from '@gosi-ui/core';
import { ProgressWizardDcComponent, BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import {
  BreadcrumbConstants,
  ChangePersonScBaseComponent,
  ManagePersonService,
  ChangePersonService,
  PersonBankDetails,
  IndividualBankDetails,
  ManagePersonConstants
} from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'cim-add-bank-details-sc',
  templateUrl: './add-bank-details-sc.component.html',
  styleUrls: ['./add-bank-details-sc.component.scss']
})
export class AddBankDetailsScComponent extends ChangePersonScBaseComponent implements OnInit {
  @ViewChild('brdcmb', { static: false })
  modifyBrdcmb: BreadcrumbDcComponent;
  personId: any;
  bankNameList: Lov;
  lang = 'en';
  bankParentForm: FormGroup = new FormGroup({});
  showAlert: boolean;
  constructor(
    readonly changePersonService: ChangePersonService,
    readonly activatedRoute: ActivatedRoute,
    readonly lookService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    private fb: FormBuilder,
    private manageService: ManagePersonService,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService
  ) {
    super(
      changePersonService,
      dashboardSearchService,
      contributorService,
      lookService,
      appToken,
      alertService,
      documentService,
      modalService,
      route
    );
  }
  modifyWizardItems: WizardItem[] = [];
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;
  activeTab = 0;
  bankDetails: IndividualBankDetails = new IndividualBankDetails();
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) this.getProfileDetails(params.identifier);
      this.personId = params.identifier;
    });
    // this.initializeWizard();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngAfterViewInit() {
    this.modifyBrdcmb.breadcrumbs = BreadcrumbConstants.INDV_BREADCRUMB_BANKVALUES;
  }

  initializeWizard() {
    this.modifyWizardItems = this.getWizards();
    this.modifyWizardItems[0].isDisabled = false;
    this.modifyWizardItems[0].isActive = true;
  } /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(ManagePersonConstants.ADD_BANK, 'address-book'));
    wizardItems.push(new WizardItem(ManagePersonConstants.ADD_BANK_VERIFY, 'clipboard-check'));
    return wizardItems;
  }

  selectWizard(selectedWizardIndex) {
    this.activeTab = selectedWizardIndex;
  }
  bindToBankForm(bankForm) {
    this.bankParentForm = new FormGroup({});
    this.bankParentForm.addControl('bankForm', bankForm);
  }

  getBank(iBanCode) {
    this.lookService.getBank(iBanCode).subscribe(
      res => (this.bankNameList = res.items[0]),
      err => this.showErrorMessage(err)
    );
  }

  submit(bankDetails) {
    if (this.showAlert == false) {
      this.bankDetails = bankDetails;
      this.manageService
        .saveBankDetails(this.personId, { ...new IndividualBankDetails(), ...this.bankDetails })
        .subscribe(
          res => {
            this.alertService.clearAlerts();
            this.alertService.showSuccess(res.bilingualMessage, null, 5);
            this.router.navigate([`/home/individual/profile`], { state: { navigatedFrom: 'addBank' } });
          },
          err => {
            this.showAlert = true;
            this.showErrorMessage(err);
          }
        );
    }
  }

  saveAndNext(event) {
    this.bankDetails = event;
    if (event) {
      this.navigateToNextTab();
    }
    // this.bankDetails = event
    // this.manageService.saveBankDetails(this.personId,this.bankDetails).subscribe((data:any)=>{
    // this.navigateToNextTab()
    //  },err => {
    //    this.alertService.showError(err.error.message);
    //  }
    //  )
  }

  showMandatoryAlert(boolVar) {
    if (boolVar == true) {
      this.showAlert = true;
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.showAlert = false;
      this.alertService.clearAlerts();
    }
  }

  navigateToNextTab() {
    this.activeTab++;
    this.progressWizardItems.setNextItem(this.activeTab);
  }

  ngOnDestroy() {
    if (this.showAlert) this.alertService.clearAlerts();
  }
}
