import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SurveyDetails, fieldList, SubChannels } from '../../../shared/models/survey';
import moment from 'moment-timezone';
import { AlertService, BilingualText, Channel, getChannel } from '@gosi-ui/core';
import { ChannelConstants } from '../../../shared/constants/survey-channel-constants';

@Component({
  selector: 'cs-survey-dc',
  templateUrl: './survey-dc.component.html',
  styleUrls: ['./survey-dc.component.scss']
})
export class SurveyDcComponent implements OnInit {
  isFieldOffice: any = false;
  @Input() surveyDetails: SurveyDetails;
  @Input() isExpired: any;
  @Input() message: any;
  @Input() isCompleted: any;
  @Input() uuid;
  error;
  smileName: any;
  index = 0;
  isSubmitted: any = false;
  userPreferenceForm: FormGroup;
  isSelected: boolean = false;
  surveyLIst: SurveyDetails;
  fieldofficeName: any;
  checkForm: FormGroup;
  subChannel: SubChannels[];
  count = 0;
  trnDate: any;
  response: any;
  channel: BilingualText;
  checkListValue: FormArray = new FormArray([]);
  filte;
  errorMsg: any;
  constructor(readonly fb: FormBuilder, readonly alertService: AlertService) {}
  ngOnInit(): void {
    this.checkForm = this.fb.group({
      checkBoxFlag: [false]
    });
    // if(this.error){
    //   this.alertService.showError(this.message)
    // }
    // const filteredArray  = ChannelConstants?.CHANNELS_FILTER_TRANSACTIONS;
    //  this.channel=filteredArray.filter(item=>{
    //     return this.subChannel.some(value=>{
    //       return item.english== value.subChannel
    //     })
    //   })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.surveyDetails && changes.surveyDetails.currentValue) {
      this.trnDate = moment(this.surveyDetails.transactionDate).toISOString();
      this.surveyLIst = changes.surveyDetails.currentValue;
      this.subChannel = this.surveyLIst.subChannelQuestions;
      this.subChannel.forEach(elem => {
        elem.id = this.count++;
      });
      this.channel = getChannel(this.surveyDetails.channel.english);
      this.createFormData();
    }
  }

  createFormData() {
    this.subChannel.forEach(() => {
      this.checkListValue.push(this.createCheckForm());
    });
  }

  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }

  responseMessage(event) {
    this.isSubmitted = true;
    this.response = event.bilingualMessage;
  }
  errorMessage(event) {
    this.error = true;
    this.errorMsg = event.message;
  }
  onChannelSelect(field, index) {
    for (let i = 0; i < this.subChannel.length; i++) {
      if (i == index) {
        this.checkListValue.controls[i].get('checkBoxFlag').patchValue(true);
      } else {
        this.checkListValue.controls[i].get('checkBoxFlag').patchValue(false);
      }
    }
    console.log(field);
    this.fieldofficeName = field.english;
  }
}
