import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AlertTypeEnum,
  BaseComponent,
  DropdownItem,
  Lov,
} from '@gosi-ui/core';
import { EstablishmentRoutesEnum, EstablishmentService } from '@gosi-ui/features/establishment';
import { MedicalInsuranceSubscribersList } from '@gosi-ui/features/establishment/lib/shared/models/medical-insurance-get-eligible-contributor';
import { fetchContributorSub } from '@gosi-ui/features/establishment/lib/shared/models/medical-insurnace-fatch-contributor-sub';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {ContributorActionEnum} from "@gosi-ui/features/contributor";
import { getDropDownItem } from '../../../../shared/utils/helper';
import {
  MedicalInsuranceRequestStatus
} from "@gosi-ui/features/contributor/lib/shared/enums/medical-insurance-request-status";

@Component({
  selector: 'est-medical-insurance-add-contributor-sc',
  templateUrl: './add-contributor-sc.component.html',
  styleUrls: ['./add-contributor-sc.component.scss']
})
export class AddContributorScComponent extends BaseComponent implements OnInit {
  chiContributorOutputList: any;
  chiContributorList: any;
  contributorSubList: fetchContributorSub;
  eligibleContributorList: any;
  saveContributorList: any;
  isEligibleContributorListDataLoaded: boolean = false;
  ischiContributorOutputListDataLoded: boolean = false;
  counter = 0;
  noEligibleContributor: boolean;
  EstRegistrationNo: number;
  isDisable: boolean = true;
  routeToView: string;
  totalSize: number;
  checkEligibleContributor: any;
  startDate: Date;
  endDate: Date;

  paginationId = 'paginationId';
  itemsPerPage = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };

  selected: boolean = false;
  isLod: boolean = false;

  isSearch = false;
  resetSearch: boolean;
  isFilter = false;
  message: string = '';

  // this for filter need to edit to use in theis case
  statusFilterForm: FormGroup;

  modalRef: BsModalRef;
  private modalService: BsModalService;
  actionList: DropdownItem[];
  @ViewChild('cancelRequestTemplate', { static: true })
  cancelRequestTemplate: TemplateRef<HTMLElement>;
  @ViewChild('modifyEnduranceRation', { static: true })
  modifyEnduranceRation: TemplateRef<HTMLElement>;
  currentContributor: any;
  enduranceRationList: Lov[];
  enduranceRationForm: FormGroup;
  currentEnduranceList: string[] = ["0%", "100%"];
  addContributorForm: FormArray;

  @Output() search: EventEmitter<object> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();

  constructor(
    modalService: BsModalService,
    private route: ActivatedRoute,
    private establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    private fb: FormBuilder,
    readonly router: Router
  ) {
    super();
    this.modalService = modalService;
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.EstRegistrationNo = Number(this.route.snapshot.paramMap.get('registrationNo'));
    this.getMedicalInsuranceSub();
    this.chiContributorList = {
      contributorDtoList: []
    };
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.actionList = this.medicalInsuranceActionsDropdownList();
    this.enduranceRationForm = this.createEnduranceRationForm();
  }

  onSelectContributor(contributor: any, event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      // increment the counter
      this.counter++;
      contributor.selected = !contributor.selected;
      if (!this.chiContributorList.contributorDtoList.includes({"socialInsuranceNo": contributor.socialInsuranceNo})) {
        this.chiContributorList.contributorDtoList.push({
          "socialInsuranceNo": contributor.socialInsuranceNo
        });
      }
    } else {
      // Decrement the counter if the checkbox is unchecked
      this.counter--;
      this.chiContributorList.contributorDtoList.pop();
    }
    contributor.selected = !contributor.selected;
  }

  onMoveToEligibleContributorList() {
    this.alertService.clearAlerts();
    this.establishmentService
      .postMedicalInsuranceContributorWithChi(this.EstRegistrationNo, this.chiContributorList)
      .subscribe(res => {
        this.chiContributorOutputList = res;
        this.chiContributorOutputList.sort((a, b) => (a.registrationStatus === b.registrationStatus) ? 0 : a.registrationStatus ? -1 : 1);
        this.checkEligibleContributor = this.chiContributorOutputList.filter(item => item.registrationStatus === true);
        this.createAddContributorForm();
        this.ischiContributorOutputListDataLoded = true;
        if (this.checkEligibleContributor.length === 0) {
          this.message = 'ESTABLISHMENT.NO-ELIGIBLE-CONTRIBUTOR-ALERT';
          this.isDisable = true;
        } else {
          this.isDisable = false;
          this.message = '';
        }
      });
  }

  Cancel() {
    this.counter = 0;
    this.chiContributorList.contributorDtoList = [];
    this.modalRef.hide();
  }

  confirmCancel() {
   this.clearList();
    this.modalRef.hide();
  }

  confirm() {
    if (!this.isDisable) {
      let payload: any = {
        contributorDtoList: []
      };
      this.addContributorForm.controls.forEach((control) => {
        payload.contributorDtoList.push(
          {
            "socialInsuranceNo": control?.get('enduranceRation.sin').value,
            "estPaymentPercentage": control?.get('enduranceRation.english').value == '100%' ? 100 : 0
          },
        )
      })
      this.establishmentService
        .postMedicalInsuranceContributorSave(this.EstRegistrationNo, payload)
        .subscribe(res => {
          this.alertService.showSuccess(res);
          this.getMedicalInsuranceSub();
        });
    }
    this.clearList();
    this.modalRef.hide();
  }

  submit(template: TemplateRef<HTMLElement>) {
    this.counter = 0;
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, Object.assign({}, {class: `modal-dialog-centered`}));
  }

  popUp(
    EligibleContributorTamplate: TemplateRef<HTMLElement>,
    tableTemplate: TemplateRef<HTMLElement>,
    confirmTemplate: TemplateRef<HTMLElement>
  ) {
    this.establishmentService.getMedicalInsuranceEligibleContributor(this.EstRegistrationNo).subscribe(res => {
      this.eligibleContributorList = res;
      this.isEligibleContributorListDataLoaded = true;
      if (this.eligibleContributorList.contributors.length === 0) {
        this.noEligibleContributor = true;
      }
    });

    let modelSize: string = '';
    let template: TemplateRef<HTMLElement>;
    if (this.noEligibleContributor) {
      template = EligibleContributorTamplate;
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, {class: `${modelSize} modal-dialog-centered`})
      );
    } else if (tableTemplate) {
      modelSize = 'modal-lg';
      template = tableTemplate;
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, {class: `${modelSize} modal-dialog-centered`})
      );
      if (this.modalRef.hide) {
        this.counter = 0;
      }
    } else {
      modelSize = 'modal-lg';
      template = confirmTemplate;
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, {class: `${modelSize} modal-dialog-centered`})
      );
    }
  }

  isButtonDisabled() {
    if (this.counter !== 0) {
      return this.isDisable == false;
    }
    return this.isDisable == true;
  }
  clearList() {
    this.chiContributorList.contributorDtoList = [];
  }

  onSearch() {}

  // this for filter
  applyFilter() {}

  // this for filter
  reset() {
    this.statusFilterForm.reset();
  }

  navigateToBack() {
    this.router.navigate([EstablishmentRoutesEnum.MEDICAL_INSURANCE_EXTENSION]);
  }

  mapRequestStatus(status: number): string {
    let message: string = null;
    switch (status) {
      case MedicalInsuranceRequestStatus.REQUESTED:
        message = 'ESTABLISHMENT.REQUESTED';
        break;
      case MedicalInsuranceRequestStatus.IN_PROGRESS:
        message = 'ESTABLISHMENT.IN_PROGRESS';
        break;
      case MedicalInsuranceRequestStatus.TO_BE_ACTIVATED:
        message = 'ESTABLISHMENT.TO_BE_ACTIVATED';
        break;
      case MedicalInsuranceRequestStatus.ACTIVATED:
        message = 'ESTABLISHMENT.ACTIVATED';
        break;
      case MedicalInsuranceRequestStatus.CANCELLED:
        message = 'ESTABLISHMENT.CANCELLED';
        break;
      case MedicalInsuranceRequestStatus.REJECTED:
        message = 'ESTABLISHMENT.REJECTED';
        break;
      case MedicalInsuranceRequestStatus.DEACTIVATED:
        message = 'ESTABLISHMENT.DEACTIVATED';
        break;
      default:
        message = '';
    }
    return message;
  }

  /**
   * This method to handle mapping request status type
   * @param status policy request status
   * @return {AlertTypeEnum}
   */
  mapRequestStatusType(status: number): AlertTypeEnum {
    let statusType: AlertTypeEnum;
    switch (status) {
      case MedicalInsuranceRequestStatus.REQUESTED:
      case MedicalInsuranceRequestStatus.IN_PROGRESS:
      case MedicalInsuranceRequestStatus.TO_BE_ACTIVATED:
        statusType = AlertTypeEnum.WARNING;
        break;
      case MedicalInsuranceRequestStatus.ACTIVATED:
        statusType = AlertTypeEnum.SUCCESS;
        break;
      case MedicalInsuranceRequestStatus.CANCELLED:
      case MedicalInsuranceRequestStatus.REJECTED:
      case MedicalInsuranceRequestStatus.DEACTIVATED:
        statusType = AlertTypeEnum.DANGER
        break;
    }
    return statusType;
  }

  mapPolicyStatus(status: number): string {
    let message: string = null;
    switch (status) {
      case 10:
        message = 'ESTABLISHMENT.EXPIRE-SOON';
        break;
      case 1:
        message = 'ESTABLISHMENT.ACTIVE';
        break;
      case 12:
        message = 'ESTABLISHMENT.EXPIRE';
        break;
    }
    return message;
  }

  paginateContributors(pageNumber: number): void {
    if (this.pageDetails.currentPage !== pageNumber) {
      this.pageDetails.currentPage = pageNumber;
      this.changeContributorList(pageNumber);
    }
  }

  changeContributorList(pageNo: number) {
    this.establishmentService
      .getMedicalInsuranceEligibleContributor(this.EstRegistrationNo, 10, pageNo - 1)
      .subscribe(res => {
        this.eligibleContributorList = res;
      });
  }

  /**
   * selected item from dropdown list
   * @param item selected item
   * @param contributor contributor details
   */
  selectedItem(item: string, contributor: any) {
    this.currentContributor = contributor;
    this.enduranceRationList = this.getEnduranceRationList();
    switch (item) {
      case ContributorActionEnum.ML_CANCEL_REQUEST:
        this.modalRef = this.modalService.show(this.cancelRequestTemplate, Object.assign({}, {class: 'modal-dialog-centered'}));
        break;
      case ContributorActionEnum.ML_MODIFY_ENDURANCE_RATION:
        this.modalRef = this.modalService.show(this.modifyEnduranceRation, Object.assign({}, {class: 'modal-dialog-centered'}));
        break;
    }
  }

  /**
   * this method to get medical insurance action dropdown list
   * @returns {DropDownItems[]}
   */
  medicalInsuranceActionsDropdownList(): DropdownItem[] {
    return [
      getDropDownItem(ContributorActionEnum.ML_MODIFY_ENDURANCE_RATION, 'pencil-alt'),
      getDropDownItem(ContributorActionEnum.ML_CANCEL_REQUEST, 'times-circle'),

    ];
  }

  /**
   * this method handle confirm cancel request
   */
  confirmCancelRequest() {
    this.establishmentService.updateMedicalInsuranceStatus(this.currentContributor?.nin?.newNin,
      {"approvalStatus": 3333, "newRequestStatus": "CANCELLED"}).subscribe(() => {
      this.alertService.showSuccessByKey(
        'CONTRIBUTOR.MEDICAL-INSURANCE.CANCEL-SUCCESS-MESSAGE');
      this.getMedicalInsuranceSub();
    }, (err) => this.alertService.showError(err?.error?.message));
    this.modalRef.hide();
  }

  /**
   * this method handle hide the modal
   */
  decline() {
    this.modalRef.hide();
  }

  SubmitModifyEndurance(): void {
    this.establishmentService.modifyMedicalInsurancePolicyDetails(
      this.currentContributor?.nin?.newNin,
      {"estPaymentPercent": (this.enduranceRationForm.get('enduranceRation.english').value === '100%' ? 100 : 0)})
      .subscribe(() => {
        this.alertService.showSuccessByKey(
          'CONTRIBUTOR.MEDICAL-INSURANCE.MODIFY-ENDURANCE-RATION-SUCCESS-MESSAGE');
        this.getMedicalInsuranceSub();
      }, (err) => this.alertService.showError(err?.error?.message));
    this.modalRef.hide();
  }

  /**
   * create search person form
   */
  createEnduranceRationForm(): FormGroup {
    return this.fb.group({
      enduranceRation: this.fb.group({
        english: [null, {validators: Validators.required, updateOn: 'blur'}],
        arabic: [null, {validators: Validators.required, updateOn: 'blur'}],
      })
    });
  }
  getEnduranceRationList(): Lov[] {
    let lovList: Lov[] = [];
    this.currentEnduranceList.forEach((value, index) => {
      lovList.push({
        value: {english: value, arabic: value},
        sequence: index + 1,
        disabled: `${this.currentContributor?.estPaymentPercent}%` === value
        }
      );
    });
    this.enduranceRationForm.get('enduranceRation.english').setValue(`${this.currentContributor?.estPaymentPercent}%` == "100%" ? "0%" : "100%");
    this.enduranceRationForm.get('enduranceRation.arabic').setValue(`${this.currentContributor?.estPaymentPercent}%` == "100%" ? "0%" : "100%");
    return lovList;
  }

  /**
   * Create Add contributor form
   * @returns {void}
   */
  createAddContributorForm(): void {
    this.enduranceRationList = this.getEnduranceRationList();
    this.addContributorForm = this.fb.array([]);
    this.checkEligibleContributor.forEach((item) => {
      this.addContributorForm.push(
        this.fb.group({
          enduranceRation: this.fb.group({
            english: ['100%', {validators: Validators.required, updateOn: 'blur'}],
            arabic: ['100%', {validators: Validators.required, updateOn: 'blur'}],
            sin: [this.mapNinToSin(item?.nin), {validators: Validators.required, updateOn: 'blur'}],
          })
        }));
    });
    }


  /**
   * Get medical insurance contributors subscriptions
   */
  getMedicalInsuranceSub():void {
    this.establishmentService.getMedicalInsuranceContributorSub(this.EstRegistrationNo).subscribe(res => {
      this.contributorSubList = res;
      this.isLod = true;
    });
  }

  /**
   * map nin to sin
   * @param nin
   */
  mapNinToSin(nin: number): number {
    let sin: number = null
    this.eligibleContributorList?.contributors.forEach((contributor) => {
      if(contributor?.identity[0]?.newNin == nin) {
        sin =contributor?.socialInsuranceNo;
      }
    })
    return sin;
  }
}
