import { Location } from '@angular/common';
import {
  Component,
  TemplateRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  DocumentService,
  getAlertSuccess,
  LanguageToken,
  Lov,
  LovList,
  UuidGeneratorService,
  EstablishmentStatusEnum,
  AlertTypeEnum
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { InjuryConstants, OhConstants } from '../../constants';
import { NavigationIndicator } from '../../enums';
import { InjuryFeedback, Establishment } from '../../models';
import { AllowanceWrapper } from '../../models/allowance-details';
import { InjuryService, OhService, EstablishmentService } from '../../services';
import { OhClaimsService } from '../../services/oh-claims.service';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'oh-modify-allowance-payee-sc',
  templateUrl: './modify-allowance-payee-sc.component.html',
  styleUrls: ['./modify-allowance-payee-sc.component.scss']
})
export class ModifyAllowancePayeeScComponent extends BaseComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  allowanceDetails: AllowanceWrapper = new AllowanceWrapper();
  lang = 'en';
  control: FormControl;
  isViewOnly = false;
  items: Lov[] = [];
  registrationNo: number;
  modalRef: BsModalRef;
  age: number = null;
  payeeList: LovList = null;
  payeeListForm: FormGroup;
  payee = 2;
  navigationIndicator: NavigationIndicator;
  scanSucess: boolean;
  documents: DocumentItem[] = [];
  payeeTransactionId = OhConstants.PAYEE_TRANSACTION_ID;
  socialInsuranceNo: number;
  uploadFailed: boolean;
  complicationId: number;
  injuryNo: number;
  injuryId: number;
  isAppPrivate: boolean;
  feedbackdetails: InjuryFeedback = new InjuryFeedback();
  feedBackMessage: Alert;
  uuid: string;
  establishment: Establishment;
  hasErrorAlert = false;
  /**
   * Input variables
   */

  @Input() payeeT: number;
  @Input() readOnlyAll: boolean;
  @Input() defaultValue = 'sa';
  @Input() defaultOnly = false;
  @Input() processType: string;
  @Input() workFlowType: string;
  @Input() disabled;

  /**
   * Output variables
   */
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();
  @ViewChild('cancelInjury', { static: false })
  private cancelInjuryModal: TemplateRef<Object>;

  /**
   * This method is used to initialise the component
   * @param language
   * @param router
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly documentService: DocumentService,
    readonly ohService: OhService,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly activatedRoute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly uuidService: UuidGeneratorService,
    readonly claimsService: OhClaimsService
  ) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   * @memberof ModifyAllowancePayeeScComponent
   */
  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.uuid = this.uuidService.getUuid();
    this.language.subscribe(language => (this.lang = language));
    this.items.push({
      value: { english: 'Contributor', arabic: ' مشترك' },
      sequence: 1
    });
    this.items.push({ value: { english: 'Establishment', arabic: 'منشأة' }, sequence: 2 });
    this.payeeList = new LovList(this.items);
    this.payeeListForm = this.createPayeeForm();
    this.alertService.clearAlerts();
    this.activatedRoute.paramMap.subscribe(res => {
      this.registrationNo = parseInt(res.get('registrationNo'), 10);
      this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
      this.injuryId = parseInt(res.get('injuryId'), 10);
      this.complicationId = parseInt(res.get('complicationId'), 10);
      this.injuryNo = parseInt(res.get('injuryNo'), 10);
    });
    this.setData();
    if (this.payeeListForm) {
      if (this.payeeT === 2) {
        this.payeeListForm.get('payeeType.english').setValue('Contributor');
        this.payeeListForm.get('payeeType.arabic').setValue(' مشترك');
      } else if (this.payeeT === 1) {
        this.payeeListForm.get('payeeType.english').setValue('Establishment');
        this.payeeListForm.get('payeeType.arabic').setValue('منشأة');
      }

      this.payeeListForm.updateValueAndValidity();
    }
    this.getAllowanceDetails();
    this.getAllowanceDocumentList();
    this.getEstablishment();
  }

  /**
   * This method is to create createPayeeForm and initialize
   * @memberof
   */
  createPayeeForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: ['Contributor', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    });
  }
  //This method is used to confirm cancellation of transaction

  confirmCancel() {
    this.modalRef.hide();
    this.alertService.clearAlerts();
    this.location.back();
  }

  //This method is to decline cancellation of transaction

  decline() {
    this.modalRef.hide();
  }

  //Setting data to services
  setData() {
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setInjuryId(this.injuryId);
    this.ohService.setInjuryNumber(this.injuryNo);
    this.ohService.setComplicationId(this.complicationId);
  }

  //Fetching Document List for the allowance
  getAllowanceDocumentList() {
    this.documentService
      .getRequiredDocuments(OhConstants.UPDATE_ALLOWANCE_PAYEE, InjuryConstants.UPDATE_PAYEE)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      )
      .subscribe((documents: DocumentItem[]) => {
        this.documents = documents;
      });
  }

  //Method to fetch the content of the document
  refreshDocument(item: DocumentItem) {
    if (item && item.name) {
      this.documentService
        .refreshDocument(item, this.injuryId, OhConstants.UPDATE_ALLOWANCE_PAYEE, InjuryConstants.UPDATE_PAYEE)
        .subscribe(res => {
          item = res;
        });
    }
  }
  /* Method to get Allowance data*/
  getAllowanceDetails() {
    this.ohService.getallowanceDetails().subscribe(res => {
      this.allowanceDetails = res;
      this.payeeT = this.allowanceDetails.allowancePayee;
      this.settingPayeeForAllowance();
    });
  }
  /**
   *
   * @param changes Values updationg on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.disabled) {
      this.disabled = changes.disabled.currentValue;
      this.settingPayeeForAllowance();
    }
  }
  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /**
   * Setting Payee
   */
  settingPayeeForAllowance() {
    if (this.workFlowType === 'Complication') {
      this.payeeListForm.get('payeeType.english').setValue('Contributor');
      this.disabled = true;
      this.payeeListForm.updateValueAndValidity();
    }
    if (this.payeeListForm) {
      if (this.payeeT === 2) {
        this.payee = 2;
        this.payeeListForm.get('payeeType.english').setValue('Contributor');
        this.payeeListForm.get('payeeType.arabic').setValue(' مشترك');
      } else if (this.payeeT === 1) {
        this.payee = 1;
        this.payeeListForm.get('payeeType.english').setValue('Establishment');
        this.payeeListForm.get('payeeType.arabic').setValue('منشأة');
      }
      this.payeeListForm.updateValueAndValidity();
    }
  }

  /*This method to select Payee List*/
  selectedpayeeList(type) {
    if (type === 'Contributor') {
      this.payeeListForm.get('payeeType.english').setValue('Contributor');
      this.payee = 2;
      this.hasErrorAlert = false;
      this.alertService.clearAllErrorAlerts();
    } else if (type === 'Establishment') {
      if (this.payeeT !== 1) {
        if (this.establishment.status.english === EstablishmentStatusEnum.CLOSED) {
          this.hasErrorAlert = true;
          this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.ALLOWANCE.PROHIBIT_UPDATE_PAYEE_CLOSED');
        }
        if (this.establishment.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS) {
          this.hasErrorAlert = true;
          this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.ALLOWANCE.PROHIBIT_UPDATE_PAYEE_INPROGRESS');
        }
      }
      this.payeeListForm.get('payeeType.english').setValue('Establishment');
      this.payee = 1;
    }
  }
  /**
   * Save and next
   */
  saveAllowancePayee() {
    if (this.isAppPrivate) {
      this.navigationIndicator = NavigationIndicator.CSR_UPDATE_PAYEE;
      for (const documentItems of this.documents) {
        if (documentItems.required && !documentItems.contentId) {
          documentItems.uploadFailed = true;
          this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
          this.scanSucess = false;
          break;
        } else {
          documentItems.uploadFailed = false;
          this.scanSucess = true;
        }
      }
    } else {
      this.navigationIndicator = NavigationIndicator.ADMIN_UPDATE_PAYEE;
    }
    if ((this.scanSucess || !this.isAppPrivate) && !this.hasErrorAlert) {
      this.injuryService.saveAllowancePayee(this.payee, this.navigationIndicator, this.uuid).subscribe(
        response => {
          this.feedBackMessage = getAlertSuccess(response, null) as Alert;
          this.claimsService.setAlert(this.feedBackMessage.message);
          this.alertService.clearAlerts();
          this.location.back();
        },
        err => {
          this.showError(err);
        }
      );
    } else if (this.hasErrorAlert) {
      if (this.establishment.status.english === EstablishmentStatusEnum.CLOSED) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.ALLOWANCE.PROHIBIT_UPDATE_PAYEE_CLOSED');
      }
      if (this.establishment.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.ALLOWANCE.PROHIBIT_UPDATE_PAYEE_INPROGRESS');
      }
    }
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   */

  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelInjuryModal, config);
  }
  getEstablishment() {
    this.establishmentService.getEstablishmentDetails(this.registrationNo).subscribe(response => {
      this.establishment = response;
    });
  }
}
