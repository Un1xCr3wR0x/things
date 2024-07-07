import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { ContactBaseHelperScComponent } from '../../../shared/components';
import {
  ApplicationTypeToken,
  UuidGeneratorService,
  AlertService,
  LookupService,
  DocumentService,
  markFormGroupTouched,
  BilingualText,
  OTPService,
  convertToYYYYMMDD,
  Establishment,
  JWTPayload,
  AuthTokenService,
  LanguageToken,
  removeEscapeChar
} from '@gosi-ui/core';
import { ValidatorService, ContactService } from '../../../shared/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ComplaintRequest, ComplaintResponse } from '../../../shared/models';
import { IdentityEnum } from '../../../shared/enums';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EstablishmentService } from '@gosi-ui/features/establishment';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'ces-register-general-complaints-Sc',
  templateUrl: './register-general-complaints.component.html',
  styleUrls: ['./register-general-complaints.component.scss']
})
export class RegisterGeneralComplaintsComponentSc extends ContactBaseHelperScComponent implements OnInit {
  otpForm: FormGroup = new FormGroup({});
  otpParentForm: FormGroup = new FormGroup({});
  request: ComplaintRequest = new ComplaintRequest();
  isOtpValid: boolean;
  otpUuid = null;
  otp = null;
  otpCount = 0;
  isDanger = true;
  itemsArray: any[] = [];
  currentAlert: BilingualText[] = [];
  isResend = false;
  enableResend = false;
  cardSelected: any = false;
  establishment: Establishment;
  isShowSection: any;
  token: JWTPayload;
  selectedItems: any[] = [];
  selectedItemsArray: any;

  tiles = [
    {
      number: '232132',
      name: 'John Doe'
    },
    {
      number: '232134',
      name: 'occ'
    },
    {
      number: '232136',
      name: 'hazard'
    },
    {
      number: '232138',
      name: 'abc'
    }
  ];
  cardItems = [
    {
      name: {
        english: 'Complaint',
        arabic: 'شكوى'
      },
      url: 'assets/images/complaint.svg',
      newUrl: 'assets/images/Complaint-White.svg'
    },
    {
      name: {
        english: 'Suggestion',
        arabic: 'اقتراح'
      },
      url: 'assets/images/Suggestion.svg',
      newUrl: 'assets/images/Suggestion-White.svg'
    },
    {
      name: {
        english: 'Enquiry',
        arabic: 'استفسار'
      },
      url: 'assets/images/Enquiry.svg',
      newUrl: 'assets/images/Enquiry-White.svg'
    }
  ];
  registerNumber: any;
  itemValue: any[] = [];
  isSelected: boolean;
  selection: boolean = true;
  successMsg: BilingualText;
  showSuccess: boolean = false;
  errorMsg: any;
  showError: boolean = false;
  selectedList: any[] = [];
  showMandatory: boolean = false;
  personId: any;
  personDetailsResponse: any;
  lang: string;
  ninType: any;
  nin: any;
  iqma: any;
  searchParam: any = '';
  noResult: boolean = false;
  /**
   *
   * @param formBuilder
   * @param alertService
   * @param lookUpService
   * @param documentService
   * @param appToken
   * @param uuidService
   * @param modalService
   * @param validatorService
   * @param contactService
   * @param otpService
   */

  constructor(
    readonly formBuilder: FormBuilder,
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly documentService: DocumentService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly uuidService: UuidGeneratorService,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly contactService: ContactService,
    readonly otpService: OTPService,
    private router: Router,
    readonly authService: AuthTokenService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,

    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService
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
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.token = this.authService.decodeToken(this.authService.getAuthToken());
    this.getDashboardEstablishmentList(this.token.uid);

    this.route.queryParams.subscribe(params => {
      if (params.registrationNo) {
        this.isShowSection = true;
        this.registerNumber = params.registrationNo;
        this.personId = params.personIdentifier;
        this.getEstablishmentDetail(this.registerNumber);

        if (this.registerNumber) {
        } else {
          this.isShowSection = false;
        }
      }
    });

    super.ngOnInit();
  }
  setContactDetails() {
    this.contactService.getEstablishmentProfileDetails().subscribe(response => {
      this.personDetailsResponse = response;
      if (this.cardSelected) {
        this.contactTypeForm.get('contactTypeForm.email').setValue(response.contactDetails?.emailId?.primary);
        this.contactTypeForm
          .get('contactTypeForm.mobileNo.isdCodePrimary')
          .setValue(response.contactDetails?.mobileNo?.isdCodePrimary);
        this.contactTypeForm
          .get('contactTypeForm.mobileNo.primary')
          .setValue(response.contactDetails?.mobileNo?.primary);
        this.contactTypeForm.updateValueAndValidity();
      }
    });
  }
  showContactDetails(event) {
    this.setContactDetails();
  }
  onBack() {}
  categoryClicked(category) {}
  isCardSelected(event) {
    this.cardSelected = event;
  }
  selectionDone() {
    this.selection = false;
    this.isSelected = true;
    this.selectedItemsArray = this.selectedItems;

    this.modalRef.hide();

    this.itemsArray = this.itemValue;
  }
  onSelectionChanged(event) {
    this.selectedItems = event;
  }
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
    this.itemsArray = this.itemValue;
  }
  resetSearch() {
    this.itemsArray = this.itemValue;
  }
  hideModal() {
    this.modalRef.hide();
    this.selection = false;
  }

  onSearch(event) {
    this.searchParam = event;
    this.itemsArray = [];
    if (event) {
      this.itemValue.forEach(res => {
        if (String(res.registrationNo).includes(event)) {
          this.itemsArray.push(res);
        }
        if (String(res.name.english).includes(event) || String(res.name.arabic).includes(event)) {
          this.itemsArray.push(res);
        }
      });
    } else {
      this.itemsArray = this.itemValue;
    }
  }

  deleteTile(item) {
    this.selectedItemsArray = this.selectedItemsArray.filter(i => i.registrationNo != item.registrationNo);
  }
  getEstablishmentDetail(registrationNo: any) {
    this.contactService.getEstablishment(registrationNo, { includeMainInfo: true }).subscribe(res => {
      this.establishment = res;
    });
  }
  getDashboardEstablishmentList(registrationNo: any) {
    this.contactService.getDashboardEstablishmentList(registrationNo).subscribe(res => {
      if (this.registerNumber) {
        this.itemsArray = res.listOfEstablishmentDetails.filter(id => id.registrationNo != this.registerNumber);
      } else {
        this.itemsArray = res.listOfEstablishmentDetails;
      }
      this.itemValue = this.itemsArray;
    });
  }
  confirmGeneralCancel() {
    this.alertService.clearAlerts();
    this.modalRef?.hide();
    this.location.back();
  }
  resetPage() {
    this.contactForm.reset();
    this.otpParentForm.reset();
    this.otpForm.reset();
    this.commentForm.reset();
    this.generateUuid();
    this.otp = null;
    this.otpUuid = null;
    this.isOtpValid = true;
    this.isTypeSelected = false;
    this.isSubTypeSelected = false;
    this.isCategorySelected = false;
    this.uploadDocuments = [];
    this.currentAlert = [];
    this.category = null;
    this.selectedItemsArray = [];
  }
  onSubmitComplaint() {
    if (this.cardSelected) {
      this.personDetailsResponse.personDetails.personIdentities.forEach(data => {
        if (data.idType == IdentityEnum.NIN) {
          this.ninType = data.idType;
          this.nin = data.newNin;
        }
        if (data.idType == IdentityEnum.IQAMA) {
          this.ninType = data.idType;
          this.iqma = data.iqamaNo;
        }
      });

      if (this.selectedList?.length == 0) {
        if (this.registerNumber) {
          this.selectedList.push(this.registerNumber);
        }
      }

      if (!this.registerNumber && this.selectedItemsArray) {
        this.selectedList = this.selectedItemsArray.map(item => item.registrationNo.toString());
      }
      this.alertService.clearAlerts();
      if (
        this.commentForm.valid &&
         (this.contactTypeForm.get('contactTypeForm.mobileNo.primary').valid || this.personDetailsResponse?.contactDetails?.mobileNo?.primary) &&
        this.contactTypeForm.get('contactTypeForm.email').valid &&
        this.contactForm?.get('categoryForm')?.get('type')?.get('english')?.value &&
        (this.contactForm?.get('categoryForm')?.get('subType')?.get('english')?.value ||
          this.contactForm?.value?.categoryForm?.complaintSubType.english)
      ) {
        if (!this.registerNumber && this.selectedList.length == 0) {
          let value = {
            english: 'Please select atleast one establishment',
            arabic: 'الرجاء اختيار منشأة واحدة على الاقل'
          };
          this.alertService.showError(value, null, 6);
          this.showError = true;
          this.showMandatory = false;
          this.showSuccess = false;
        } else {
          this.request = {
            category: this.contactForm?.value?.categoryForm?.category?.english,
            type: this.contactForm?.value?.categoryForm?.type?.english,
            subType: this.contactForm?.value?.categoryForm?.subType?.english,
            description: this.commentForm.value.csrComment,
            complainant: null,
            registrationNo: null,
            registrationNos: this.selectedList,

            transactionRefNo: parseInt(this.contactForm?.value?.categoryForm?.complaintSubType?.english),
            uuid: this.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? this.uuid : null,
            complainantDetails: {
              name: this.personDetailsResponse.personDetails.name.arabic
                ? this.personDetailsResponse.personDetails.name.arabic.firstName +
                  ' ' +
                  this.personDetailsResponse.personDetails.name.arabic.secondName +
                  ' ' +
                  this.personDetailsResponse.personDetails.name.arabic.thirdName
                : this.personDetailsResponse.personDetails.name.english,
              birthDate: {
                gregorian: convertToYYYYMMDD(
                  moment(this.personDetailsResponse.personDetails.dateOfBirth.gregorian).toString()
                ),
                hijiri: this.personDetailsResponse.personDetails.dateOfBirth.hijiri
              },
              identity: {
                idType: this.ninType,
                iqamaNo: this.iqma ? this.iqma : '',

                newNin: this.nin ? this.nin : ''
              },
              contactDetail: {
                email: this.contactTypeForm?.value?.contactTypeForm?.email,
                phoneNo: this.contactTypeForm?.value?.contactTypeForm?.mobileNo?.primary 
                ? this.contactTypeForm?.value?.contactTypeForm?.mobileNo?.primary 
                : this.personDetailsResponse?.contactDetails?.mobileNo?.primary
              }
            },
            csrComment: removeEscapeChar(this.commentForm?.value?.csrComment)
          };

          this.contactService.submitRequest(this.request, this.otp).subscribe(
            (complaintResponse: ComplaintResponse) => {
              this.showSuccess = true;
              this.showError = false;
              this.showMandatory = false;
              this.successMsg = complaintResponse.message;
              if (this.registerNumber) {
                this.selectedList = [];
              }
              this.alertService.showSuccess(this.successMsg, null, 6);
              this.resetPage();
            },
            error => {
              if (this.registerNumber) {
                this.selectedList = [];
              }
              this.showError = true;
              this.showMandatory = false;
              this.showSuccess = false;
              this.errorMsg = error.error.message;
              this.alertService.showError(this.errorMsg, null, 6);
            }
          );
        }
      } else {
        markFormGroupTouched(this.contactForm);
        markFormGroupTouched(this.commentForm);
        markFormGroupTouched(this.contactTypeForm);
        this.showMandatory = true;
        this.showError = false;
        this.showSuccess = false;
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      this.showMandatory = true;
      this.showError = false;
      this.showSuccess = false;
      this.alertService.showMandatoryErrorMessage();
    }
  }
}
