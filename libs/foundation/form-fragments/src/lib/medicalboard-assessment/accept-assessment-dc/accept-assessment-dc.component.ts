import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BilingualText, GosiCalendar, MedicalAssessment } from '@gosi-ui/core';
import moment from 'moment';

@Component({
  selector: 'gosi-ui-accept-assessment-dc',
  templateUrl: './accept-assessment-dc.component.html',
  styleUrls: ['./accept-assessment-dc.component.scss']
})
export class AcceptAssessmentDcComponent implements OnInit {
  //Input Variables
  @Input() heading = '';
  @Input() isAccept: boolean;
  @Input() isReschedule: boolean
  @Input() assessmentDetails: MedicalAssessment[];
  @Input() assessmentForm: FormGroup;
  @Input() message: string;
  @Input() selectedDate: GosiCalendar;
  @Input() virtual:BilingualText = new BilingualText();
  //Output Variables
  @Output() onConfirmassessment = new EventEmitter();
  @Output() onCancelassessment = new EventEmitter();
  @Output() onCancelreschedule = new EventEmitter();
  @Output() onconfirmreschedule = new EventEmitter();
  selectValue: string;
  messageVirtual: number;

  constructor() {}

  ngOnInit(): void {
    const vir = this.virtual
    console.log(vir?.english);
    this.assessmentDetails;
   this.selectValue = moment(this.selectedDate?.gregorian)?.format('DD-MM-YYYY');
   this.messageVirtual = this.assessmentDetails[0]?.channelType;
   console.log(this.messageVirtual);
  }
  confirm() {
    this.onConfirmassessment.emit();
  }

  decline() {
    this.onCancelassessment.emit();
  }
  declinreschedule(){
    this.onCancelreschedule.emit();
  }
  confirmreschedule() {
    this.onconfirmreschedule.emit();
  }
}
