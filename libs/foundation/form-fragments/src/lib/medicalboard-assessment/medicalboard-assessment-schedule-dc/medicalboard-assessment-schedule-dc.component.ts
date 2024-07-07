import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MedicalAssessment, DisabilityData } from '@gosi-ui/core';

@Component({
  selector: 'gosi-ui-medicalboard-assessment-schedule-dc',
  templateUrl: './medicalboard-assessment-schedule-dc.component.html',
  styleUrls: ['./medicalboard-assessment-schedule-dc.component.scss']
})
export class MedicalboardAssessmentScheduleDcComponent implements OnInit {
  //Input Variables
  @Input() assessmentDetails: MedicalAssessment[];
  @Input() heading = '';
  @Input() temp!: any;
  @Input() previousDisabilityDetails: DisabilityData;

  //Output Variables
  @Output() confirmassessment: EventEmitter<MedicalAssessment> = new EventEmitter();
  @Output() show: EventEmitter<HTMLElement> = new EventEmitter();
  @Output() cancelassessment: EventEmitter<null> = new EventEmitter();
  @Output() showreschedule: EventEmitter<any> = new EventEmitter();

  //variables
  sessionId: number;
  inviteId: number;
  assessment: MedicalAssessment;
  medicalAssessmentreschedule: MedicalAssessment[];
  accepted: boolean;
  rescheduled: boolean;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.assessmentDetails;
  }

  // Method to emit approve details
  onClickAccept(template, assessment) {
    this.sessionId = assessment.sessionId;
    this.inviteId = assessment.inviteId;
    this.assessment = assessment;
    this.show.emit(template);
    this.accepted = true;
    this.rescheduled = false;
  }
  declineassessment() {
    this.cancelassessment.emit();
  }
  confirmassessmentEvent() {
    this.confirmassessment.emit(this.assessment);
  }
  onClickReschedule(): void {
    this.medicalAssessmentreschedule = this.assessmentDetails;
    this.showreschedule.emit({ temp: this.temp, medicalAssessmentreschedule: this.medicalAssessmentreschedule });
  }
}
