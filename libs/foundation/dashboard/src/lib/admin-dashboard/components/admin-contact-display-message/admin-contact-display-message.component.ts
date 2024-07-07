import {  Component, EventEmitter, Inject, OnChanges, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { AlertService, ApplicationTypeToken, AuthTokenService, BilingualText, LanguageToken } from '@gosi-ui/core';
import { ContactResponse, GetContactResponse, PersonContact} from '@gosi-ui/features/customer-information/lib/shared/models/person-contact';
import { UpdateUserContactService } from '@gosi-ui/features/customer-information/lib/shared/services/update-user-contact.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';


enum ActionType {
  NONE,
  VERIFY_MOBILE_EMAIL
}

enum STEP {
  START,
  DISPLAY_MESSAGE,
  INSERT_MOBILE_OTP,
  MOBILE_OTP_VERIFIED,
  INSERT_EMAIL_OTP,
  EMAIL_OTP_VERIFIED
}
@Component({
  selector: 'gosi-ui-admin-contact-display-message',
  templateUrl: './admin-contact-display-message.component.html',
  styleUrls: ['./admin-contact-display-message.component.scss']
})
export class AdminContactDisplayMessageComponent implements OnInit , OnDestroy ,OnChanges  {
  action:ActionType = ActionType.VERIFY_MOBILE_EMAIL;
  message = "";
  cancelButtonText =  "DASHBOARD.VERIFY-CONTACT-LATER" ;
  okButtonText = "DASHBOARD.VERIFY-CONTACT-START";
  header = "DASHBOARD.VERIFY-CONTACT-HEADER"
  mobile:string = "";
  email:string = "";
  isdCodePrimary:string = "";
  contactId:string = "";
  emailOTPUuid:string = "";
  mobileOTPUuid:string = "";
  lang = "ar";
  userMessage = "";
  modalRef: BsModalRef;
  currentAlert: BilingualText[] = [];
  isOtpValid: boolean;
  enableResend = false;
  isResend = false;
  otpUuid = null;
  otp = null;
  otpCount = 0;
  isDanger = true;
  step:STEP = STEP.START;
  otpForm = new FormGroup({});
  displaySubmitButton:boolean = true;
  displayCancelButton:boolean = false;
  displayUpdateButton:boolean = true;
  contactList: PersonContact[] = [];
  config = { backdrop: true, ignoreBackdropClick: true, class: `modal-dialog-centered` };
  updateContactRoute = '/home/profile/user-activity/update-user-contact';
  @ViewChild('contactMessageTemplate') contactMessageTemplate: TemplateRef<HTMLElement>;
  @ViewChild('OTPTemplate') OTPTemplate: TemplateRef<HTMLElement>;
  @Output() routeTo: EventEmitter<string> = new EventEmitter();

  constructor(readonly modalService: BsModalService,readonly fb: FormBuilder,
    
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly updateContactService:UpdateUserContactService,
    readonly alertService: AlertService,
    readonly authService: AuthTokenService) { }

    ngOnChanges() {
      this.language.subscribe(language => {
        this.lang = language;
      });
    }


  ngOnInit(): void {   
    /* this.loadContacts(); */
  }

  ngOnDestroy(): void {
    this.hideModal();
  }
 
  loadContacts() {
    const token = this.authService.decodeToken(this.authService.getAuthToken());
    this.updateContactService.getContactList(token.uid).subscribe(
      (response:GetContactResponse) =>{
        let displayDialog = false;
        response.contactDetails.forEach( (contact:ContactResponse  )=>{
          if(contact.isVerified != true){
            displayDialog = true;
          }
         
        });

        if(displayDialog){
          this.message = 'DASHBOARD.VERIFY-CONTACT-MSG';
          this.modalRef = this.modalService.show(this.contactMessageTemplate, this.config);
        }
      }
    )
  }

  
  
    
  hideModal(): void {
    if (this.modalRef) this.modalRef.hide();
  }

  getMessage() : string{
    let text = "";
    if(this.lang === "en"){
      text += "Your have unverified contacts is. ";
       
      text += ". You should verify your mobile and email to continue applying services";
    }else{
      text += "عزيزى المستفيد لديك منشّات ليس لها بيانات اتصال   ";
    }
    return text;
  }

   
  
   
}
