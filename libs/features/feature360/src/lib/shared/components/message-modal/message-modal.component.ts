import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil, filter, startWith } from 'rxjs/operators';
import { SMSResponseType } from '@gosi-ui/core/lib/models/sms-response-type';
import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { BilingualText, SendSMSNotificationService, BaseComponent, RoleIdEnum, JWTPayload } from '@gosi-ui/core';

@Component({
  selector: 'fea-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent extends BaseComponent implements OnInit {
  isSendMessage = false;
  modalRef: BsModalRef;
  curMobileNumber = null;
  invalidMSISDN = null;
  messageID = null;
  status = null;
  statusDescription = null;
  error: BilingualText;
  selectedLang = 'en';
  accessRoles = [RoleIdEnum.SEND_SMS];
  responseTypes: SMSResponseType[];

  @Input() token: JWTPayload;
  @Input() details: string;
  constructor(private modalService: BsModalService, readonly sendSMSNotificationService: SendSMSNotificationService) {
    super();
  }

  ngOnInit(): void {}

  getSourceSystem(event) {
    this.sendSMSNotificationService
      .getListOfResponses(this.selectedLang, event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.responseTypes = res.elements));
  }

  showPopupSendMessage(mobileNumber, template: TemplateRef<HTMLElement>) {
    this.isSendMessage = false;
    this.curMobileNumber = mobileNumber;
    const ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }

  sendMessage(message) {
    this.sendSMSNotificationService.SendSMS(message.mobileNumber, message.message).subscribe(
      sendSMSResponse => {
        this.invalidMSISDN = sendSMSResponse.InvalidMSISDN;
        this.messageID = sendSMSResponse.MessageID;
        this.status = sendSMSResponse.Status;
        this.statusDescription = sendSMSResponse.StatusDescription;
        this.isSendMessage = true;
      },
      err => {
        this.error = err?.error?.message;
        this.isSendMessage = false;
      }
    );
  }
  close() {
    this.isSendMessage = false;
    this.curMobileNumber = null;
    this.modalRef.hide();
  }
}
