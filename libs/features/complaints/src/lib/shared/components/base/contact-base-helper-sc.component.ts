/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentClassificationEnum,
  DocumentItem,
  DocumentService,
  Establishment,
  IdentityTypeEnum,
  Iqama,
  LookupService,
  LovList,
  NIN,
  UuidGeneratorService,
  markFormGroupUntouched
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ComplaintConstants, LovListConstants, TransactionConstants } from '../../constants';
import { CategoryEnum } from '../../enums';
import { CustomerSummary, EstablishmentSummary } from '../../models';
import { ValidatorService } from '../../services';
@Directive()
export abstract class ContactBaseHelperScComponent extends BaseComponent implements OnInit, OnDestroy {
  /*
   * Local variables
   */

  noOfResend = 3;
  noOfIncorrectOtp = 0;
  commentForm: FormGroup;
  establishmentSummary: EstablishmentSummary = undefined;
  customerSummary: CustomerSummary = undefined;
  category: string = null;
  documents: DocumentItem[] = [];
  businessKey: number = null;
  transactionTraceId: number = null;
  uuid: string;
  uploadDocuments: DocumentItem[] = [];
  sequenceNumber: number;
  customerIdentity: number = null;
  categoryList$: Observable<LovList>;
  subTypeLabel: string;
  subTypeList$: Observable<LovList>;
  modalRef: BsModalRef;
  subTypePlaceholder = ComplaintConstants.SUBTYPE_PLACEHOLDER;
  textLabel: string;
  textPlaceholder: string;
  transactionId: number = null;
  typeLabel: string;
  typeList$: Observable<LovList>;
  isAppPrivate = false;
  typePlaceholder = ComplaintConstants.TYPE_PLACEHOLDER;
  contactForm: FormGroup = new FormGroup({});
  contactTypeForm: FormGroup = new FormGroup({});
  /**
   * local variables
   */
  complaintUser: number = null;
  descriptionLabel = ComplaintConstants.DESCRIPTION_LABEL;
  docCategory: string;
  isCategorySelected = false;
  isComplaintSubmitted = false;
  isSubTypeSelected = false;
  isTypeSelected = false;
  registrationNo: string;
  selectedCategory: string = null;
  showFindUs = false;
  showLabel = false;
  showType = true;
  subTypeList: BehaviorSubject<LovList>;
  typeList: BehaviorSubject<LovList>;
  userTypeList$: Observable<LovList>;
  /**
   *
   * @param validatorService
   * @param documentService
   * @param uuidService
   * @param alertService
   */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }

  // Method to intialise tasks

  ngOnInit(): void {
    this.commentForm = this.createCommentForm();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.categoryList$ = this.lookUpService
      .getContactLists(LovListConstants.CATEGORY, LovListConstants.DOMAIN_CATEGORY)
      .pipe(
        map((res: LovList) => {
          if (res && res.items && res.items.length > 0) {
            return new LovList(res.items.filter(item => Number(item.code) !== 1004 && Number(item.code) !== 1005));
          }
        })
      );
    this.setLabel();
  }
  /**
   * create comment form
   */
  createCommentForm(): FormGroup {
    return this.formBuilder.group({
      csrComment: [null, this.isAppPrivate ? null : { validators: [Validators.required], updateOn: 'blur' }],
      checkBoxForUpload: [null]
    });
  }
  /**
   * Method to set labels for dropdowns
   */
  setLabel() {
    this.typeLabel = ComplaintConstants.TYPE_LABEL;
    this.subTypeLabel = ComplaintConstants.SUBTYPE_LABEL;
    if (this.isAppPrivate) {
      this.textLabel = ComplaintConstants.COMPLAINTS_DESCRIPTION;
      this.textPlaceholder = ComplaintConstants.COMPLAINTS_COMMENTS;
    } else {
      this.textLabel = ComplaintConstants.YOUR_MESSAGE;
    }
  }
  /**
   * Method to handle focus event on components
   */
  onFocus() {
    this.alertService.clearAlerts();
  }
  /**cancel otp template

   */
  onCancelTemplate() {
    this.modalRef.hide();
    this.noOfIncorrectOtp = 0;
  }
  /**
   * method to select type
   */

  onCategoryRegister(category, isAdmin: boolean = false) {
    this.onCategorySelection(category, isAdmin);
  }
  onCategorySelection(category: string, isAdmin: boolean = false): void {
    //console.log(category);
    this.contactForm?.get('categoryForm')?.get('category')?.get('english')?.setValue(category);
    this.isTypeSelected = false;
    this.isSubTypeSelected = false;
    this.showType = true;
    this.subTypeList = new BehaviorSubject<LovList>(new LovList([]));
    this.subTypeList$ = this.subTypeList.asObservable();
    if (this.contactForm?.get('categoryForm')?.get('type') && this.contactForm?.get('categoryForm')?.get('subType')) {
      this.contactForm?.get('categoryForm')?.get('type')?.updateValueAndValidity();
      this.contactForm?.get('categoryForm')?.get('subType')?.updateValueAndValidity();
      this.contactForm?.get('categoryForm')?.get('complaintSubType')?.updateValueAndValidity();
      this.contactForm?.get('categoryForm')?.get('complaintSubType')?.get('english')?.setValue(null);

      this.contactForm?.get('categoryForm')?.get('type')?.get('english')?.setValue(null);
      this.contactForm?.get('categoryForm')?.get('subType')?.get('english')?.setValue(null);
      markFormGroupUntouched(this.contactForm?.get('categoryForm')?.get('complaintSubType') as FormGroup);

      markFormGroupUntouched(this.contactForm?.get('categoryForm')?.get('type') as FormGroup);
      markFormGroupUntouched(this.contactForm?.get('categoryForm')?.get('subType') as FormGroup);
    }
    if (category === null) {
      this.transactionId = null;
      this.isCategorySelected = false;
      this.selectedCategory = null;
      this.docCategory = null;
      this.showType = true;
      this.category = null;
      this.subTypeList = new BehaviorSubject<LovList>(new LovList([]));
      this.subTypeList$ = this.subTypeList.asObservable();
      this.descriptionLabel = ComplaintConstants.DESCRIPTION_LABEL;
      this.typeList = new BehaviorSubject<LovList>(new LovList([]));
      this.typeList$ = this.typeList.asObservable();
      this.setLabel();
      this.removeAllDocuments();
    } else {
      this.selectedCategory = category;
      this.docCategory = category;
      this.category = category;
      this.sequenceNumber = 1;
      this.isCategorySelected = true;
      this.generateUuid();
      this.setTransactionId(category);
      this.removeAllDocuments(false);
      if (LovListConstants.LABELS.filter(item => item.value === category).length > 0) {
        if (category !== CategoryEnum.SUGGESTION) {
          this.typeLabel = LovListConstants.LABELS.find(item => item.value === category).typeLabel;
          this.subTypeLabel = LovListConstants.LABELS.find(item => item.value === category).subTypeLabel;
        } else if (category === CategoryEnum.SUGGESTION) {
          this.typeLabel = LovListConstants.LABELS.find(item => item.value === category).suggestionTypeLabel;
          this.subTypeLabel = LovListConstants.LABELS.find(item => item.value === category).suggestionSubTypeLabel;
        }
        this.descriptionLabel = LovListConstants.LABELS.find(item => item.value === category).desriptionLabel;
      }
      if (category === CategoryEnum.COMPLAINT) {
        this.selectedCategory = CategoryEnum.COMPLAINT;
      }

      if (this.appToken === ApplicationTypeEnum.PUBLIC || isAdmin) {
        const categories = `${this.category}${'GOL'}`;
        this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, categories);
      } else {
        if (category === CategoryEnum.ENQUIRY || category === CategoryEnum.COMPLAINT) {
          const categories = `${
            this.category === CategoryEnum.ENQUIRY
              ? this.registrationNo
                ? LovListConstants.LOVLIST_ESTABLISHMENT
                : LovListConstants.LOVLIST_CONTRIBUTOR
              : ''
          }${this.category}`;
          this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, categories);
        } else if (this.category === CategoryEnum.SUGGESTION)
          this.typeList$ = this.lookUpService.getContactLists(
            LovListConstants.CATEGORY,
            LovListConstants.SUGGESTION_CATEGORY
          );
      }
    }
  }
  /**
   * Method to set transaction ID
   * @param category
   */
  setTransactionId(category: string) {
    if (TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.filter(item => item.category === category).length > 0) {
      this.transactionId = TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
        item => item.category === category
      ).transactionId;
    }
  }
  /*
   * This method is to select the category sub type
   */
  onCategoryTypeSelect(type: string, isAdmin: boolean = false): void {
    this.isSubTypeSelected = false;
    if (this.contactForm?.get('categoryForm')?.get('subType')) {
      this.contactForm?.get('categoryForm')?.get('subType')?.updateValueAndValidity();
      this.contactForm?.get('categoryForm').get('subType')?.get('english')?.setValue(null);
      markFormGroupUntouched(this.contactForm?.get('categoryForm')?.get('subType') as FormGroup);
    }
    if (type === null) {
      this.isTypeSelected = false;

      this.subTypeList = new BehaviorSubject<LovList>(new LovList([]));
      this.subTypeList$ = this.subTypeList.asObservable();
    } else {
      this.isTypeSelected = true;

      if (this.appToken === ApplicationTypeEnum.PUBLIC || isAdmin) {
        const domainName = `${this.category}${'GOL'}${type}`.replace(/\s+/g, '');
        this.subTypeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, domainName);
      } else {
        const domainName = `${
          this.category === CategoryEnum.ENQUIRY
            ? this.registrationNo
              ? LovListConstants.LOVLIST_ESTABLISHMENT
              : LovListConstants.LOVLIST_CONTRIBUTOR
            : ''
        }${this.category}${type}`.replace(/\s+/g, '');
        this.subTypeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, domainName);
      }
    }
  }
  /**
   * Method to get establishment details
   * @param registrationNo
   */
  getEstablishmentDetails(registrationNo: string) {
    if (registrationNo !== null)
      this.validatorService.getEstablishment(Number(registrationNo)).subscribe((res: Establishment) => {
        this.establishmentSummary = new EstablishmentSummary();
        if (res?.contactDetails?.mobileNo?.isdCodePrimary && res?.contactDetails?.mobileNo?.primary)
          this.establishmentSummary.establishmentContactNumber = `${res?.contactDetails?.mobileNo?.isdCodePrimary} ${res?.contactDetails?.mobileNo?.primary}`;
        else if (res?.contactDetails?.mobileNo?.primary)
          this.establishmentSummary.establishmentContactNumber = res?.contactDetails?.mobileNo?.primary;
        else this.establishmentSummary.establishmentContactNumber = null;

        this.establishmentSummary.establishmentEmailId =
          res && res.contactDetails && res.contactDetails.emailId && res.contactDetails.emailId.primary;
        this.establishmentSummary.establishmentName = res.name;
        if (
          !this.establishmentSummary.establishmentName.english &&
          this.establishmentSummary.establishmentName.arabic
        ) {
          this.establishmentSummary.establishmentName.english = this.establishmentSummary.establishmentName.arabic;
        }
        this.establishmentSummary.registrationNo = res.registrationNo;
      });
  }

  /**
   * Method to get customer details
   * @param personId
   * @param registrationNo
   */
  getCustomerDetails(personId: number, registrationNo: string = null) {
    if (personId !== null)
      this.validatorService
        .getPersonDetails(personId)
        .pipe(
          tap(res => {
            this.customerSummary = new CustomerSummary();
            this.customerSummary = res;
            this.customerSummary.customerType =
              registrationNo === null ? ComplaintConstants.INDIVIDUAL : ComplaintConstants.ESTABLISHMENT_ADMIN;
          })
        )
        .subscribe();
  }

  /**
   * method to denerate uuid
   */
  generateUuid() {
    this.uuid = this.uuidService.getUuid();
  }
  /**
   * Method to get required document list
   */
  getRequiredDocuments() {
    this.getDocumentDetails().subscribe((documentResponse: DocumentItem[]) => {
      if (this.customerIdentity) {
        documentResponse = documentResponse.filter(
          item => item.documentClassification === DocumentClassificationEnum.EXTERNAL
        );
      }
      documentResponse.forEach(item => {
        item.uuid = this.uuid;
        item.sequenceNumber = this.sequenceNumber;
        if (this.customerIdentity) item.userAccessList.push(`${this.customerIdentity}`);
        else{
        if(this.customerSummary?.id?.idType === IdentityTypeEnum.NIN){
          item.userAccessList.push(`${(<NIN>this.customerSummary?.id)?.newNin}`)
        }
        else if(this.customerSummary?.id?.idType === IdentityTypeEnum.IQAMA){
          item.userAccessList.push(`${(<Iqama>this.customerSummary?.id)?.iqamaNo}`) 
        }
        }
        this.uploadDocuments.push(item);
      });
      this.sequenceNumber++;
    });
  }
  /**
   * Method to get document details
   */
  getDocumentDetails() {
    const docDetails = TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
      item => item.category?.toLowerCase() === this.category?.toLowerCase()
    );
    const docTransactionId = docDetails?.docTransactionId;
    const transactionType = docDetails?.transactionType;
    if (docTransactionId && transactionType) {
      if (this.customerIdentity) return this.documentService.getRequiredDocuments(docTransactionId, transactionType);
      else
        return this.documentService.getDocuments(
          docTransactionId,
          transactionType,
          null,
          this.transactionTraceId,
          null,
          this.uuid,
          this.sequenceNumber
        );
    } else return of([]);
  }

  /**
   * Method to get refresh document list
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (this.category) {
      this.documentService
        .refreshDocument(
          document,
          this.transactionTraceId,
          TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
            item => item.category?.toLowerCase() === this.category?.toLowerCase()
          )?.docTransactionId,
          TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
            item => item.category?.toLowerCase() === this.category?.toLowerCase()
          )?.transactionType,
          null,
          null,
          this.uuid,
          document.sequenceNumber
        )
        .pipe(
          tap(res => (document = res)),
          catchError(err => {
            this.alertService.showError(err.error.message);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  /**
   * Method to delete all documents
   * @param isRemoveAll
   */
  removeAllDocuments(isRemoveAll = true) {
    this.uploadDocuments.forEach(doc => {
      this.documentService
        .deleteDocument(
          this.transactionTraceId,
          doc.name.english,
          null,
          this.uuid,
          doc.sequenceNumber,
          undefined,
          doc.documentTypeId
        )
        .subscribe();
      this.uploadDocuments = this.uploadDocuments.filter(item => item.sequenceNumber !== doc.sequenceNumber);
    });
    if (this.uploadDocuments.length === 0 && !isRemoveAll) {
      this.getRequiredDocuments();
    }
  }
  /**
   * Method to delete the upload documents
   * @param document
   */
  removeDocuments(document: DocumentItem) {
    this.uploadDocuments = this.uploadDocuments.filter(item => item.sequenceNumber !== document.sequenceNumber);
    if (this.uploadDocuments.length === 0) {
      this.getRequiredDocuments();
    }
  }
  /**
   * Method to reset the document component
   */
  resetDocumentComponent() {
    this.removeAllDocuments();
  }
  /**
   * Method of cancel template
   */
  onCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Method of cancel template
   */
  openPopupWindow(template: TemplateRef<HTMLElement>, size = 'md') {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Method to hide modal
   */
  decline() {
    this.modalRef.hide();
  }
  /**
   * Method to hide modal
   */
  confirmCancel() {
    this.removeAllDocuments();
    this.modalRef.hide();
  }
  /**
   * This method is to perform cleanup activities when an instance of component is destroyed.
   */
  ngOnDestroy() {
    this.uploadDocuments = [];
    this.sequenceNumber = 1;
    super.ngOnDestroy();
  }
  /*
   * This method is to hide the modal reference.
   */
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
}
