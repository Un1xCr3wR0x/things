import { Inject, TemplateRef } from '@angular/core';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  LookupService,
  LovList,
  scrollToModalError,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { PersonConstants } from '../constants/person-constants';

export abstract class ChangePersonScBaseComponent extends BaseComponent {
  // LovLists
  nationalityList: Observable<LovList>;
  educationList: Observable<LovList>;
  specializationList: Observable<LovList>;
  cityList: Observable<LovList>;
  gccCountryList: Observable<LovList>;

  isCsr = false;
  showOtpError: boolean;

  //Documents
  personDocumentList: DocumentItem[];
  documentList$: Observable<DocumentItem[]>;

  //ModalRef
  commonModalRef: BsModalRef;
  constructor(
    readonly lookService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly alertService: AlertService,
    readonly documentService,
    public modalService: BsModalService
  ) {
    super();
    if (appToken === ApplicationTypeEnum.PRIVATE) {
      this.isCsr = true;
    } else {
      this.isCsr = false;
    }
  }

  initialiseLookups() {
    this.nationalityList = this.lookService.getNationalityList();
    this.gccCountryList = this.lookService.getGccCountryList();
    this.educationList = this.lookService.getEducationList();
    this.specializationList = this.lookService.getSpecializationList();
    this.cityList = this.lookService.getCityList();
  }

  /**
   *Method to Clear alerts
   */
  clearAlerts() {
    this.alertService.clearAlerts();
    this.clearAlert();
    if (this.personDocumentList) {
      this.personDocumentList.forEach(document => {
        document.uploadFailed = false;
      });
    }
  }

  /**
   *Method to Clear alerts when otp error is null
   */
  clearAlert() {
    this.showOtpError = false;
  }

  /* Document Functionalities */
  getDocumentList() {
    this.documentList$ = this.documentService.getRequiredDocuments(
      PersonConstants.NONSAUDI_DOCUMENT_TRANSACTION_KEY,
      PersonConstants.DOCUMENT_TRANSACTION_TYPE
    );
    this.documentList$.subscribe((documents: DocumentItem[]) => (this.personDocumentList = documents));
  }

  /**
   * Generic method to hide the modals
   */
  hideModal() {
    this.alertService.clearAlerts();
    this.clearAlert();
    this.commonModalRef?.hide();
  }

  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }

  /**
   * Wrapper method to scroll to top of modal
   */
  goToTop() {
    scrollToTop();
  }

  /**
   * Wrapper method to scroll to top of modal
   */
  modalScroll() {
    scrollToModalError();
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
}
