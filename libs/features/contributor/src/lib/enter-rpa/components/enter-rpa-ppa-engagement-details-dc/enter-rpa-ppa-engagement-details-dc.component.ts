import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LanguageToken } from "@gosi-ui/core";
import { SearchEngagementResponse } from "@gosi-ui/features/contributor";
import { BehaviorSubject } from "rxjs";
import { RpaAppointmentDetails } from "../../../shared/models/enter-rpa-appointment-details";

@Component({
  selector: 'cnt-enter-rpa-ppa-engagement-details-dc',
  templateUrl: './enter-rpa-ppa-engagement-details-dc.component.html',
  styleUrls: ['./enter-rpa-ppa-engagement-details-dc.component.scss']
})
export class EnterRpaPpaEngagementDetailsDcComponent {
  lang = 'en';
  appointmentForm: FormGroup;
  appoinmentDetails:RpaAppointmentDetails;
  currentDate = new Date();
  maxAppointmentLength = 15;



  @Input() engagements: SearchEngagementResponse;
  @Output() save: EventEmitter<RpaAppointmentDetails> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  @Output() cancelRpa: EventEmitter<null> = new EventEmitter();
  imageClick: boolean;



  constructor(
    readonly fb:FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.language.subscribe(res => (this.lang = res));
  }

  ngOnInit(): void {
    this.appointmentForm =this.createAppointmentForm()
  }

  createAppointmentForm(){
    return this.fb.group({
      appointmentDate:this.fb.group({
        gregorian: [null],
        hijiri: [null],
        entryFormat: 'GREGORIAN'
      }),
      appointmentNumber:[null],
      acknowledge: [false, Validators.requiredTrue]
    });
  }

  saveEngagementDetails() {
    this.appointmentForm.markAllAsTouched();
    if(this.appointmentForm.invalid ){
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    }
    else{
    this.appoinmentDetails = new RpaAppointmentDetails();
    this.appoinmentDetails.appointmentDate.gregorian = this.appointmentForm.get('appointmentDate').get('gregorian').value;
    this.appoinmentDetails.appointmentDate.hijiri = null;
    this.appoinmentDetails.appointmentDate.entryFormat = 'GREGORIAN';
    this.appoinmentDetails.appointmentNumber = this.appointmentForm.get('appointmentNumber').value;
    this.save.emit(this.appoinmentDetails)
    }
  }
  cancel() { 
    this.cancelRpa.emit()
  }
  
  imageClicked(){
    this.imageClick = true;
  }


}