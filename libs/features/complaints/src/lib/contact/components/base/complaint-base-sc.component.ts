/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  StorageService,
  UuidGeneratorService,
  ApplicationTypeEnum,
  LovList,
  Lov,
  markFormGroupUntouched,
  AdminDto,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LovListConstants, ComplaintConstants } from '../../../shared/constants';
import { ContactService, ValidatorService } from '../../../shared/services';
import { Observable, BehaviorSubject } from 'rxjs';
import { ComplaintResponse, ComplaintRequest } from '../../../shared/models';
import { Location } from '@angular/common';
import { ContactBaseHelperScComponent } from '../../../shared/components';
import { map } from 'rxjs/operators';

@Directive()
export abstract class ComplaintBaseScComponent extends ContactBaseHelperScComponent implements OnInit {
  /**
   * local variables
   */
  admins: AdminDto;
  businessKey: number = null;
  category: string;
  categoryList$: Observable<LovList>;
  complaintUser: number = null;
  contactForm: FormGroup;
  descriptionLabel = ComplaintConstants.DESCRIPTION_LABEL;
  docCategory: string;
  isAppPrivate = false;
  isCategorySelected = false;
  isComplaintSubmitted = false;
  isSubTypeSelected = false;
  isTypeSelected = false;
  registrationNo: string;
  selectedCategory: string = null;
  showFindUs = false;
  showLabel = false;
  showType = true;
  subTypeLabel: string;
  subTypeList$: Observable<LovList>;
  subTypeList: BehaviorSubject<LovList>;
  subTypePlaceholder = ComplaintConstants.SUBTYPE_PLACEHOLDER;
  textLabel: string;
  textPlaceholder: string;
  transactionId: number = null;
  typeLabel: string;
  typeList$: Observable<LovList>;
  typeList: BehaviorSubject<LovList>;
  typePlaceholder = ComplaintConstants.TYPE_PLACEHOLDER;
  userTypeList$: Observable<LovList>;

  /**
   *
   * @param formBuilder
   * @param alertService
   * @param lookUpService
   * @param contactService
   * @param modalService
   * @param documentService
   * @param appToken
   * @param uuidService
   * @param storageService
   * @param route
   * @param router
   * @param location
   * @param validatorService
   */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly contactService: ContactService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly uuidService: UuidGeneratorService,
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly location: Location,
    readonly validatorService: ValidatorService
  ) {
    super(
      formBuilder,
      validatorService,
      documentService,
      uuidService,
      alertService,
      lookUpService,
      modalService,
      appToken
    );
  }
  /**
   * method to initialise the component
   */
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.contactForm = this.createContactForm();
    this.setUserTypeForm();
    this.categoryList$ = this.lookUpService
      .getContactLists(LovListConstants.CATEGORY, LovListConstants.DOMAIN_CATEGORY)
      .pipe(
        map((res: LovList) => {
          if (res && res.items && res.items.length > 0) {
            return new LovList(res.items.filter(item => Number(item.code) !== 1004 && Number(item.code) !== 1005));
          }
        })
      );
    // this.setLabels();
  }
  /**
   * Method to handle focus event on components
   */
  onFocus() {
    this.alertService.clearAlerts();
  }
  /**
   * Method to set labels for dropdowns
   */
  // setLabels() {
  //   this.typeLabel = ComplaintConstants.TYPE_LABEL;
  //   this.subTypeLabel = ComplaintConstants.SUBTYPE_LABEL;
  //   if (this.isAppPrivate) {
  //     this.textLabel = ComplaintConstants.COMPLAINTS_DESCRIPTION;
  //     this.textPlaceholder = ComplaintConstants.COMPLAINTS_COMMENTS;
  //   } else {
  //     this.textLabel = ComplaintConstants.YOUR_MESSAGE;
  //   }
  // }
  /**
   * Method to create contact us form
   */
  createContactForm(): FormGroup {
    return this.formBuilder.group({
      category: this.formBuilder.group({
        english: [this.selectedCategory, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      type: this.createTypeForm(),
      subType: this.createTypeForm(),
      message: [null, Validators.compose([Validators.required])]
    });
  }
  /**
   * Method to create create type form
   */
  createTypeForm(): FormGroup {
    return this.formBuilder.group({
      english: [null, Validators.compose([Validators.required])],
      arabic: [null]
    });
  }

  /**
   * Method to reset form
   */
  resetMessage() {
    this.contactForm.get('message').setValue(null);
    this.contactForm.updateValueAndValidity();
    this.contactForm.get('message').markAsUntouched();
    this.contactForm.get('message').markAsPristine();
  }
  /*
   * This method is to select the category type
   */
  /**
   * 
   * @param category 
   onCategorySelection(category: string): void {
    this.isTypeSelected = false;
    this.isSubTypeSelected = false;
    this.showType = true;
    this.subTypeList = new BehaviorSubject<LovList>(new LovList([]));
    this.subTypeList$ = this.subTypeList.asObservable();
    if (this.contactForm.get('type') && this.contactForm.get('subType')) {
      this.contactForm.updateValueAndValidity();
      this.contactForm.get('type').get('english').setValue(null);
      this.contactForm.get('subType').get('english').setValue(null);
      markFormGroupUntouched(this.contactForm.get('type') as FormGroup);
      markFormGroupUntouched(this.contactForm.get('subType') as FormGroup);
    }
    if (category === null) {
      this.transactionId = null;
      this.isCategorySelected = false;
      this.selectedCategory = null;
      this.docCategory = null;
      this.showType = true;
      this.subTypeList = new BehaviorSubject<LovList>(new LovList([]));
      this.subTypeList$ = this.subTypeList.asObservable();
      this.descriptionLabel = ComplaintConstants.DESCRIPTION_LABEL;
      this.typeList = new BehaviorSubject<LovList>(new LovList([]));
      this.typeList$ = this.typeList.asObservable();
      this.setLabels();
      this.removeAllDocuments();
    } else {
      this.selectedCategory = category;
      this.docCategory = category;
      this.category = category;
      this.sequenceNumber = 0;
      this.generateUuid();
      this.setTransactionId(category);
      this.removeAllDocuments(false);
      this.isCategorySelected = CategoryEnum.SUGGESTION !== category ? true : false;
      if (CategoryEnum.SUGGESTION === category) this.resetUserControl();
      this.isSubTypeSelected = CategoryEnum.SUGGESTION === category ? true : false;
      if (LovListConstants.LABELS.filter(item => item.value === category).length > 0) {
        this.typeLabel = LovListConstants.LABELS.find(item => item.value === category).typeLabel;
        this.subTypeLabel = LovListConstants.LABELS.find(item => item.value === category).subTypeLabel;
        this.descriptionLabel = LovListConstants.LABELS.find(item => item.value === category).desriptionLabel;
        if (!this.isAppPrivate) {
          this.textLabel = ComplaintConstants.YOUR_MESSAGE;
        }
      }
      if (category === CategoryEnum.ENQUIRY && !this.isAppPrivate) {
        category = LovListConstants.ESTABLISHMENT.concat(category);
      }
      if (category !== CategoryEnum.SUGGESTION || this.isAppPrivate) {
        this.typeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, category);
      }
      this.showType = CategoryEnum.SUGGESTION !== category ? true : false;
      this.showFindUs = CategoryEnum.COMPLAINT === category ? true : false;
      if (category === CategoryEnum.COMPLAINT) {
        this.selectedCategory = CategoryEnum.COMPLAINT;
      }
      if (this.isAppPrivate && this.showFindUs) {
        this.showLabel = true;
      }
      if (category === CategoryEnum.SUGGESTION) {
        this.contactForm.removeControl('type');
        this.contactForm.removeControl('subType');
      } else {
        this.contactForm.addControl('type', this.createTypeForm());
        this.contactForm.addControl('subType', this.createTypeForm());
      }
    }
    this.resetMessage();
  }
  */
  /*
   * This method is to select the category sub type
   */
  /**
   * 
   * @param category 
   onCategoryTypeSelect(category: string): void {
    this.isSubTypeSelected = false;
    if (this.contactForm.get('subType')) {
      this.contactForm.updateValueAndValidity();
      this.contactForm.get('subType').get('english').setValue(null);
      markFormGroupUntouched(this.contactForm.get('subType') as FormGroup);
    }
    if (category === null) {
      this.isTypeSelected = false;

      this.subTypeList = new BehaviorSubject<LovList>(new LovList([]));
      this.subTypeList$ = this.subTypeList.asObservable();
    } else {
      this.isTypeSelected = CategoryEnum.SUGGESTION !== category ? true : false;
      if (category === LovListConstants.GOSI_WEBSITE.value) {
        category = LovListConstants.GOSI_WEBSITE.subValue;
      }
      let domainName = ' ';
      if (category === LovListConstants.BRANCHES.value) {
        domainName = LovListConstants.BRANCHES.subValue;
      } else {
        domainName = LovListConstants.ESTABLISHMENT.concat(this.selectedCategory, category);
        domainName = domainName.replace(/\s+/g, '');
      }
      if (
        category === LovListConstants.ANNUITY ||
        category === LovListConstants.SANED ||
        category === LovListConstants.MEDICAL_BOARD
      ) {
        domainName = LovListConstants.ENQUIRY_TYPES.find(item => item.value === category).subValue;
      }
      if (this.selectedCategory !== CategoryEnum.SUGGESTION) {
        this.subTypeList$ = this.lookUpService.getContactLists(LovListConstants.CATEGORY, domainName);
      }
    }
  }
*/
  /**
   * Method handle back event
   */
  onBack() {
    this.removeAllDocuments();
  }
  /**
   * Method to set transaction ID
   * @param category
   */
  /**
   * 
   * @param category 
   setTransactionId(category: string) {
    if (TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.filter(item => item.category === category).length > 0) {
      this.transactionId = TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
        item => item.category === category
      ).transactionId;
    }
  }
*/

  /**
   * Method to create user type form
   */
  setUserTypeForm() {
    if (this.isAppPrivate) this.contactForm.addControl('usertype', this.createTypeForm());
    else this.contactForm.removeControl('usertype');
  }
  /**
   * Method to set category on selecting user type
   */
  onUserTypeSelection(user: Lov) {
    this.complaintUser = user.code;
  }
  /*
   * This method is to submit contact details
   */
  onSubmit(): void {
    this.alertService.clearAlerts();
    this.contactForm.updateValueAndValidity();
    if (this.contactForm.valid) {
      const complaintRequest: ComplaintRequest = new ComplaintRequest();
      complaintRequest.category = LovListConstants.LABELS.find(
        item => item.value === this.contactForm.value.category.english
      ).dbValue;
      if (this.contactForm.value.type) complaintRequest.type = this.contactForm.value.type.english;
      if (this.contactForm.value.subType) complaintRequest.subType = this.contactForm.value.subType.english;
      complaintRequest.description = this.contactForm.value.message;
      complaintRequest.uuid = this.uuid;
      complaintRequest.registrationNo = this.registrationNo;
      complaintRequest.complainant = this.complaintUser;
      this.contactService.submitRequest(complaintRequest).subscribe(
        (complaintResponse: ComplaintResponse) => {
          this.contactForm.reset();
          this.isCategorySelected = false;
          this.isTypeSelected = false;
          this.isSubTypeSelected = false;
          this.transactionId = null;
          this.selectedCategory = null;
          this.isComplaintSubmitted = true;
          this.contactService.setSuccessMessage(complaintResponse.message);
          this.contactService.setIsComplaintSubmitted(this.isComplaintSubmitted);
          this.location.back();
          this.alertService.showSuccess(complaintResponse.message);
        },
        error => {
          this.alertService.showError(error.error.message);
        }
      );
    } else {
      markFormGroupTouched(this.contactForm);
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /**
   * method on subtype selection
   * @param subType
   */
  onCategorySubTypeSelect(subType: string) {
    this.isSubTypeSelected = false;
    this.resetUserControl();
    if (subType !== null) {
      this.isSubTypeSelected = true;
    }
  }
  /**
   * method to reset form
   */
  resetUserControl() {
    if (this.contactForm.get('usertype') && this.contactForm.get('usertype').get('english')) {
      this.contactForm.updateValueAndValidity();
      this.contactForm.get('usertype').get('english').setValue(null);
      markFormGroupUntouched(this.contactForm.get('usertype') as FormGroup);
    }
  }
  /**
   * method to fetch admin details
   * @param registrationNo
   */
  getAdminDetails(registrationNo: string) {
    this.userTypeList$ = this.contactService.getAdminDetails(registrationNo);
  }
  /**
   * Just a workaround to handle userid .Because no login as of now
   */
  getComplainantDetails() {
    this.getAdminDetails(this.registrationNo);
    if (this.userTypeList$) {
      this.userTypeList$.subscribe((res: LovList) => {
        if (res) this.complaintUser = res.items[0].code;
      });
    }
  }
}
