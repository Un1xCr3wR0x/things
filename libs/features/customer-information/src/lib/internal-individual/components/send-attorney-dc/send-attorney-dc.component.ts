import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched } from '@gosi-ui/core';
import { AttorneyService } from '../../../shared/services/attorney.service';

@Component({
  selector: 'gosi-fea-send-attorney-dc',
  templateUrl: './send-attorney-dc.component.html',
  styleUrls: ['./send-attorney-dc.component.scss']
})
export class SendAttorneyDcComponent implements OnInit {
    @Input() isAttorneyVerified = false;
    @Input() ninumber;
    @Input() isAttorneySend = false;
    
    @Input() attorneyStatus;
    @Input() agentFullName;
    @Input() agentId;
    @Input() agentIsValid;
    @Input() authorizerListFullName;
    @Input() authorizerListId;
    @Input() authorizerListIsValid;
    @Input() attorneyText;
    @Input() authList;
    @Input() lang;
    
	//@Input() token: JWTPayload;
    @Output() send: EventEmitter<any> = new EventEmitter();
    @Output() verify: EventEmitter<null> = new EventEmitter();
    @Output() close: EventEmitter<null> = new EventEmitter();

    sendAttorneyForm: FormGroup = null;
    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.sendAttorneyForm = this.createSendAttorneyForm();

    }
    createSendAttorneyForm() {
        return this.fb.group({
            data: [null, Validators.required]
        });
    }

    sendAttorney() {
        this.send.emit({'agentId': this.ninumber, 'attorneyNumber': this.sendAttorneyForm.controls['data'].value});
    }

    closeWindow() {
        this.close.emit();
    }

    translateStatus(status: boolean) {
        if (this.lang === 'en') {
            return status ? 'Active' : 'Inactive';
          } else { return status ?  'ساريه' : 'غير ساريه';}        
    }
}