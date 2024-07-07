import { Component, Inject, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddressTypeEnum,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  markFormGroupTouched,
  scrollToTop,
  setAddressFormToAddresses,
  WizardItem
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  BreadcrumbConstants,
  ChangePersonScBaseComponent,
  ChangePersonService,
  ModifyContactRequest
} from '../../../shared';
import { BreadcrumbDcComponent, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
@Component({
  selector: 'cim-modify-contact-details-sc',
  templateUrl: './modify-contact-details-sc.component.html',
  styleUrls: ['./modify-contact-details-sc.component.scss']
})
export class ModifyContactDetailsScComponent extends ChangePersonScBaseComponent implements OnInit, OnDestroy {
  addressForms = new FormGroup({});
  modifyWizardItems: WizardItem[] = [];
  PERSON_DETAILS = 'CUSTOMER-INFORMATION.PERSONAL-DETAILS';
  VERIFY = 'CUSTOMER-INFORMATION.VERIFY';
  currentTab = 0;
  personId: number;
  request = new ModifyContactRequest();
  isIndividualApp: boolean;
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poAddressType = AddressTypeEnum.POBOX;
  readonly foriegnType = AddressTypeEnum.OVERSEAS;
  @ViewChild('receiveContributionWizard', { static: false }) /** Child components */
  receiveContributionWizard: ProgressWizardDcComponent;
  /** Template and directive references */
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDetailsComponent: ContactDcComponent;
  @ViewChild('brdcmb', { static: false })
  modifyBrdcmb: BreadcrumbDcComponent;
  constructor(
    readonly changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService,
    readonly lookService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly activatedRoute: ActivatedRoute,
    public modalService: BsModalService,
    readonly router: Router,
    readonly route: ActivatedRoute
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

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) this.getProfileDetails(params.identifier);
      this.personId = params.identifier;
    });
    this.initializeWizard();
    this.initialiseLookups();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }
  submitChanges() {
    this.alertService.clearAlerts();
    this.createFormData();
    markFormGroupTouched(this.addressForms);

    let isAddressContactValid = true;
    isAddressContactValid =
      this.addressDetailsComponent.getAddressValidity() && this.addressForms?.get('contactDetail')?.valid;
    let modifyRequest = new ModifyContactRequest();
    modifyRequest = this.request;
    if (isAddressContactValid) {
      this.changePersonService.submitContactDetails(this.personId, modifyRequest).subscribe(
        res => {
          if (res.bilingualMessage) {
            this.router.navigate([`/home/individual/profile`]);
            this.alertService.showSuccess(res.bilingualMessage, null, 5);
          }
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  ngAfterViewInit() {
    this.modifyBrdcmb.breadcrumbs = BreadcrumbConstants.INDV_BREADCRUMB_VALUES;
  }
  createFormData() {
    if (this.addressForms) {
      this.request.emailId = this.addressForms?.get('contactDetail')?.get('emailId')?.value;
      this.request.mobileNo = this.addressForms?.get('contactDetail')?.get('mobileNo')?.value;
      this.request.currentMailingAddress = this.addressForms?.get('currentMailingAddress')?.value;
      const addressArray = [];
      if (this.addressForms.get('saudiAddress') as FormGroup) {
        addressArray.push((this.addressForms.get('saudiAddress') as FormGroup).getRawValue());
      }
      if (this.addressForms.get('foreignAddress') as FormGroup) {
        addressArray.push((this.addressForms.get('foreignAddress') as FormGroup).getRawValue());
      }
      if (this.addressForms.get('poBoxAddress') as FormGroup) {
        addressArray.push((<FormGroup>this.addressForms.get('poBoxAddress')).getRawValue());
      }
      if (this.isIndividualApp) {
        this.request.addresses = setAddressFormToAddresses(this.addressForms);
      } else {
        this.request.addresses = addressArray;
      }
    }
  }
  navigateToNext() {
    markFormGroupTouched(this.addressForms);
    //  if (this.addressForms.valid) {
    this.createFormData();

    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab = 1;
    this.nextForm();
    //  }
    //  else this.alertService.showMandatoryErrorMessage();
  }
  nextForm() {
    scrollToTop();
    this.alertService.clearAlerts();
    if (this.receiveContributionWizard) this.receiveContributionWizard.setNextItem(this.currentTab);
  }
  navigateToPrevious() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    // this.receiveContributionWizard.setPreviousItem(this.currentTab);
    this.hideModal();
    this.router.navigate([`/home/individual/profile`]);
  }
  initializeWizard() {
    this.modifyWizardItems = this.getWizards();
    this.modifyWizardItems[0].isDisabled = false;
    this.modifyWizardItems[0].isActive = true;
  } /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(this.PERSON_DETAILS, 'address-book'));
    wizardItems.push(new WizardItem(this.VERIFY, 'clipboard-check'));
    return wizardItems;
  }
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  backTo() {
    this.hideModal();
    this.router.navigate(['/home/individual/profile']);
  }
  showModalRef(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'md'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
