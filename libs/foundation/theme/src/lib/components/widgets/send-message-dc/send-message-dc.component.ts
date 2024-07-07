import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageToken, markFormGroupTouched, SendSMSNotificationService, RoleIdEnum, JWTPayload } from '@gosi-ui/core';
import { SMSResponseType } from '@gosi-ui/core/lib/models/sms-response-type';
import { SmsServiceType } from '@gosi-ui/core/lib/models/sms-service-type';
import { SMSTemplateService } from '@gosi-ui/core/lib/services/sms-template-service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { tap, switchMap, exhaustMap, throttle } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'gosi-fea-send-message-dc',
  templateUrl: './send-message-dc.component.html',
  styleUrls: ['./send-message-dc.component.scss']
})
export class SendMessageDcComponent implements OnInit {
  @Input() mobileNumber: string;
  @Input() responseTypes: SMSResponseType[];
  @Input() set isSend(value: boolean) {
    if (value) {
      this.noRequest.next(false);
      this.lastRequestIsSent = value;
    }
  }
  @Input() token: JWTPayload;
  @Input() details: string;
  @Output() send: EventEmitter<object> = new EventEmitter();
  @Output() sourceSystem: EventEmitter<string> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();
  sendSMSRole = [RoleIdEnum.SEND_SMS];
  smsManagementRole = [RoleIdEnum.SMS_MANAGEMENT];
  freeTextSMSRole = [RoleIdEnum.SMS_FREE_TEXT];
  type = new Subject<string>();
  lastRequestIsSent = false;
  sendMsg = true;
  manageMsg = false;
  sendMessageForm: FormGroup = null;
  editMode = false;
  addMode = false;
  deleteMode = false;
  newServiceType = '';
  newMessage = '';
  selectedServiceType = null;
  editedMsgBody = '';
  msgTitle = '';
  msgID = null;
  smsObj = null;
  selectedLang = 'en';
  deletedMsgId = null;
  deletedMsgBody = null;
  smsDeletedObj = null;
  sourceSystemType = '';
  editServiceType = false;
  editMsgTitle = true;
  freeText = false;
  newId: number;
  niNum: string | number;
  regNum: string | number;
  noRequest = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private sMSTemplateService: SMSTemplateService,
    private activatedRoute: ActivatedRoute,
    readonly sendSMSNotificationService: SendSMSNotificationService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.sendMessageForm = this.createSendMessageForm();
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
    this.activatedRoute.paramMap.subscribe(res => {
      if (res.get('niNum')) {
        this.niNum = res.get('niNum');
      } else {
        this.niNum = res.get('personId');
      }
      this.regNum = res.get('regNum');
    });
    this.type.pipe(throttle(() => this.noRequest)).subscribe(type => {
      this.sendMessage(type);
    });
  }

  getAllSMSTemplates() {
    this.sMSTemplateService.getListOfResponses(this.selectedLang).subscribe(
      response => {
        this.responseTypes = response.elements;
      },
      error => {}
    );
  }

  createSendMessageForm() {
    return this.fb.group({
      message: [null, Validators.required],
      mobileNumber: [null, [Validators.required, Validators.pattern('^[0].*$'), Validators.minLength(10)]]
    });
  }

  sendTypeSMS(typeSMS: string): void {
    this.type.next(typeSMS);
  }

  sendMessage(type: string) {
    markFormGroupTouched(this.sendMessageForm);
    if (!this.sendMessageForm.valid) {
      return;
    }
    this.noRequest.next(true);
    this.sMSTemplateService
      .getMaxSmsAuditId()
      .pipe(exhaustMap(response => of(response[0].MAXID + 1)))
      .subscribe(
        response => (type === 'sendSMS' ? this.saveSMS(response) : this.saveFreeText(response)),
        err => this.noRequest.next(false)
      );
  }

  saveSMS(id: number): void {
    let request = null;
    if (this.details === 'individual') {
      request = this.sMSTemplateService.saveSMSSendMessage(
        id,
        1,
        this.newId,
        null,
        this.sendMessageForm.getRawValue().mobileNumber,
        Number(this.niNum),
        null,
        this.token.sub,
        this.sendDate(),
        this.token.sub
      );
    } else if (this.details === 'establishment') {
      request = this.sMSTemplateService.saveSMSSendMessage(
        id,
        1,
        this.newId,
        null,
        this.sendMessageForm.getRawValue().mobileNumber,
        null,
        Number(this.regNum),
        this.token.sub,
        this.sendDate(),
        this.token.sub
      );
    } else if (this.details === 'sideBar') {
      request = this.sMSTemplateService.saveSMSSendMessage(
        id,
        1,
        this.newId,
        null,
        this.sendMessageForm.getRawValue().mobileNumber,
        null,
        null,
        this.token.sub,
        this.sendDate(),
        this.token.sub
      );
    }
    request.subscribe(
      () => this.emitSMS(),
      err => this.noRequest.next(false)
    );
  }

  saveFreeText(id: number): void {
    let newSMSFreeTextID = null;
    this.sMSTemplateService
      .getMaxSMSFreeTextId()
      .pipe(
        tap(responseID => (newSMSFreeTextID = responseID[0].MAXID + 1)),
        switchMap(() =>
          this.sMSTemplateService.saveSMSFreeText(
            newSMSFreeTextID,
            this.sendMessageForm.getRawValue().message,
            this.selectedLang,
            this.token.sub,
            null
          )
        ),
        switchMap(() =>
          this.sMSTemplateService.saveSMSSendMessage(
            id,
            2,
            null,
            newSMSFreeTextID,
            this.sendMessageForm.getRawValue().mobileNumber,
            null,
            null,
            this.token.sub,
            moment(new Date()).format('yyyy-MM-DDTHH:mm:ss'),
            this.token.sub
          )
        )
      )
      .subscribe(
        () => this.emitSMS(),
        err => this.noRequest.next(false)
      );
  }

  sendDate() {
    return moment(new Date()).format('yyyy-MM-DDTHH:mm:ss');
  }

  emitSMS(): void {
    this.send.emit({
      message: this.sendMessageForm.getRawValue().message,
      mobileNumber: this.sendMessageForm.getRawValue().mobileNumber
    });
  }

  selectChangeHandler(event: SmsServiceType): void {
    this.sendMessageForm.controls.message.setValue(event.BODY);
    this.selectedServiceType = event;
    this.newId = event.ID;
  }

  selectSystemSource(event: string): void {
    this.sourceSystem.emit(event);
    this.sourceSystemType = event;
  }

  closeWindow() {
    this.close.emit();
  }

  selectOperation(operation) {
    if (operation === 'add') {
      this.manageMsg = false;
      this.addMode = true;
      this.editMode = false;
      this.sendMsg = false;
      this.deleteMode = false;
      this.sendMessageForm.controls.message.setValue('');
    } else if (operation === 'edit') {
      this.manageMsg = false;
      this.addMode = false;
      this.editMode = true;
      this.sendMsg = false;
      this.deleteMode = false;
      this.sendMessageForm.controls.message.setValue('');
    } else if (operation === 'delete') {
      this.manageMsg = false;
      this.addMode = false;
      this.editMode = false;
      this.sendMsg = false;
      this.deleteMode = true;
      this.sendMessageForm.controls.message.setValue('');
    }
  }

  getMaxSmsId() {
    this.sMSTemplateService.getMaxSmsId().subscribe(
      response => {
        const newSMSID = response[0].MAXID + 1;
        this.sMSTemplateService
          .saveSMSTemplate(
            newSMSID,
            this.newServiceType,
            this.newMessage,
            this.selectedLang,
            'SMS',
            this.sourceSystemType
          )
          .subscribe(
            res => {
              this.newMessage = '';
              this.newServiceType = '';
              this.sourceSystemType = '';
              this.getAllSMSTemplates();
            },
            error => {
              this.newMessage = '';
              this.newServiceType = '';
              this.sourceSystemType = '';
            }
          );
      },
      error => {}
    );
  }

  addNewSms() {
    this.getMaxSmsId();
  }

  viewMsgData(mode?) {
    if (mode === 'delete') {
      this.deletedMsgId = this.smsDeletedObj.ID;
      this.deletedMsgBody = this.smsDeletedObj.BODY;
    } else {
      this.msgID = this.smsObj.ID;
      this.msgTitle = this.smsObj.GROUPTYPE;
      this.editedMsgBody = this.smsObj.BODY;
    }
  }

  updateSMSTemplate() {
    this.sMSTemplateService
      .updateSMSTemplate(this.msgID, this.msgTitle, this.editedMsgBody, this.selectedLang, 'SMS', this.sourceSystemType)
      .subscribe(
        response => {
          this.msgTitle = '';
          this.editedMsgBody = '';
          this.smsObj = null;
          this.sourceSystemType = '';
          this.editServiceType = false;
          this.getAllSMSTemplates();
        },
        error => {
          this.msgTitle = '';
          this.editedMsgBody = '';
          this.smsObj = null;
          this.sourceSystemType = '';
          this.editServiceType = false;
        }
      );
  }

  deleteSMSTemplate() {
    this.sMSTemplateService.deleteSMSTemplate(this.deletedMsgId).subscribe(
      response => {
        this.smsDeletedObj = null;
        this.deletedMsgBody = null;
        this.getAllSMSTemplates();
      },
      error => {
        this.smsDeletedObj = null;
        this.deletedMsgBody = null;
        this.getAllSMSTemplates();
      }
    );
  }

  resetManageMsgValues() {
    this.msgTitle = '';
    this.editedMsgBody = '';
    this.smsObj = null;
    this.smsDeletedObj = null;
    this.deletedMsgBody = null;
    this.newMessage = '';
    this.newServiceType = '';
    this.sourceSystemType = '';
    this.editServiceType = false;
  }
}
