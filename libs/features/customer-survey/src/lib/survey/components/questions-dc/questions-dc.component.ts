import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {
  SurveyDetails,
  SubChannels,
  Questions,
  SelectedOptions,
  SurveyRequest,
  Options,
  Smile
} from '../../../shared/models/survey';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, ControlContainer } from '@angular/forms';
import { LovList, bindToObject, Lov, markFormGroupTouched, markFormGroupUntouched } from '@gosi-ui/core';
import { CustomerSurveyService } from '../../../shared';

@Component({
  selector: 'cs-questions-dc',
  templateUrl: './questions-dc.component.html',
  styleUrls: ['./questions-dc.component.scss']
})
export class QuestionsDcComponent implements OnInit {
  smiles: Smile[] = [
    {
      id: 1,
      name: 'CUSTOMER-SURVEY.EXCELLENT',
      image: 'assets/icons/Excellent.svg',
      rating: 5,
      newUrl: 'assets/icons/Excellent-coloured.svg'
    },
    {
      id: 2,
      name: 'CUSTOMER-SURVEY.GOOD',
      image: 'assets/icons/Good.svg',
      rating: 4,
      newUrl: 'assets/icons/Good-coloured.svg'
    },
    {
      id: 3,
      name: 'CUSTOMER-SURVEY.NEUTRAL',
      image: 'assets/icons/Neutral.svg',
      rating: 3,
      newUrl: 'assets/icons/Neutral-coloured.svg'
    },
    {
      id: 4,
      name: 'CUSTOMER-SURVEY.BAD',
      image: 'assets/icons/Bad.svg',
      rating: 2,
      newUrl: 'assets/icons/Bad-coloured.svg'
    },
    {
      id: 5,
      name: 'CUSTOMER-SURVEY.WORSE',
      image: 'assets/icons/Worse.svg',
      rating: 1,
      newUrl: 'assets/icons/Worse-coloured.svg'
    }
  ];
  smileName: any;
  subChannelQuestionList: SubChannels[];
  questionLists: any;
  textListValue: FormArray = new FormArray([]);
  radioListValue: FormArray = new FormArray([]);
  checkListValue: FormArray = new FormArray([]);
  checkForm: FormGroup;
  checkBoxList: Questions[];
  radioButtonList: any[];
  textBoxList: any[];
  RadioForm: FormGroup;
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  selectedIndex: any;
  selectedOptions: SelectedOptions[] = [];
  options: any[] = [];
  responseArray: SurveyRequest[] = [];
  response: {};
  selectedQUes: any;
  surveyRequest: any;
  isAdded: any[];
  selectedQuestionId: any;
  textAreaForm: FormGroup;
  count: any = 1;
  isRadioInvalid: any;
  isTextInvalid: boolean;
  isSubmitDisable: boolean = true;
  error: boolean;

  constructor(readonly fb: FormBuilder, private surveySurvice: CustomerSurveyService) {}
  @Input() surveyLIst: any;
  labelName: string;
  @Input() uuid;
  @Input() fieldofficeName: string;
  @Output() responseMessage: EventEmitter<null> = new EventEmitter();
  @Output() errorMessage: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {
    this.comments = new FormControl(null);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.labelName = changes.fieldofficeName.currentValue;
    if (this.labelName && this.smileName) {
      this.responseArray = [];
      this.radioListValue = new FormArray([]);
      this.textListValue = new FormArray([]);
      this.checkListValue = new FormArray([]);
      this.comments.setValue('');
      this.showQuestions(this.smileName, this.labelName);
    }
  }
  imageClick(smile, index) {
    this.responseArray = [];
    this.comments.setValue('');
    this.radioListValue = new FormArray([]);
    this.textListValue = new FormArray([]);
    this.checkListValue = new FormArray([]);
    this.selectedIndex = index;
    this.smileName = smile;
    this.subChannelQuestionList = this.surveyLIst.subChannelQuestions;
    if (this.fieldofficeName && this.subChannelQuestionList.length > 1) {
      this.showQuestions(this.smileName, this.labelName);
    }
    if (this.subChannelQuestionList.length == 1) {
      this.showQuestions(this.smileName, '');
    }
  }

  showQuestions(smile, channelName) {
    if (this.subChannelQuestionList.length > 1) {
      const sub = this.subChannelQuestionList.filter(rbq => rbq.subChannel.english == channelName);
      const rating = sub.forEach(element => {
        let value = element.ratingBasedQuestions.filter(data => data.rating == smile.rating);
        this.questionLists = value;
        this.questionsToBind();
        this.isSubmitDisable = false;
      });
    } else {
      const rating = this.subChannelQuestionList.forEach(element => {
        let value = element.ratingBasedQuestions.filter(data => data.rating == smile.rating);
        this.questionLists = value;
        this.questionsToBind();
        this.isSubmitDisable = false;
      });
    }
  }

  questionsToBind() {
    this.questionLists.forEach(element => {
      this.checkBoxList = element.questions.filter(ele => ele.questionType == 1000);
      this.checkBoxCreateFrom();
      this.setCheckBoxValidity();
      this.radioButtonList = element.questions.filter(ele => ele.questionType == 1001);
      this.radioCreateFrom();
      this.setRadioValidity();
      this.radioButtonList.forEach(res => {
        const valueList = new LovList([]);
        res.options.map((item, index) => {
          valueList.items.push({
            code: item.optionId,
            value: item.options,
            sequence: index
          });
        });
        res.valueList = valueList;
      });
      this.textBoxList = element.questions.filter(ele => ele.questionType == 1002);
      this.createFormData();
      this.setTextBoxValidity();
    });
  }
  setCheckBoxValidity() {
    this.checkBoxList.forEach((elem, index) => {
      if (elem.required == true) {
        this.checkListValue.controls[index].get('checkBoxFlag').setValidators([Validators.required]);
      } else {
        this.checkListValue.controls[index].get('checkBoxFlag').clearValidators();
      }
      this.checkListValue.controls[index].get('checkBoxFlag').updateValueAndValidity();
    });
  }
  setRadioValidity() {
    this.radioButtonList.forEach((elem, index) => {
      if (elem.required == true) {
        this.radioListValue.controls[index].get('radioFlag').get('english').setValidators([Validators.required]);
      } else {
        this.radioListValue.controls[index].get('radioFlag').get('english').clearValidators();
      }
      this.radioListValue.controls[index].get('radioFlag').get('english').updateValueAndValidity();
    });
  }
  setTextBoxValidity() {
    this.textBoxList.forEach((elem, index) => {
      if (elem.required == true) {
        this.textListValue.controls[index].get('answer').setValidators([Validators.required]);
      } else {
        this.textListValue.controls[index].get('answer').clearValidators();
      }
      this.textListValue.controls[index].get('answer').updateValueAndValidity();
    });
  }
  radioCreateFrom() {
    this.radioButtonList.forEach(() => {
      this.radioListValue.push(this.createRadioForm());
    });
  }
  createRadioForm(): FormGroup {
    return this.fb.group({
      radioFlag: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  checkBoxCreateFrom() {
    this.checkBoxList.forEach(() => {
      this.checkListValue.push(this.createcheckBoxForm());
    });
  }
  createcheckBoxForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [null, { validators: Validators.required }]
    });
  }
  createFormData() {
    this.textBoxList.forEach(() => {
      this.textListValue.push(this.createTextForm());
    });
  }

  createTextForm(): FormGroup {
    return this.fb.group({
      answer: [null, { validators: Validators.required, updateOn: 'blur' }]
    });
  }
  onChannelSelect(event, option, question, i, j) {
    const index = this.responseArray.findIndex(item => item.questionId == question.questionId);
    if (this.checkListValue.controls[j].get('checkBoxFlag').value == true) {
      if (index === -1) {
        const newPaylad = {
          questionId: question.questionId,
          bilingualAnswers: [
            {
              english: option.english,
              arabic: option.arabic
            }
          ]
        };
        this.responseArray.push(newPaylad);
      } else {
        this.responseArray[index]?.bilingualAnswers.push({
          english: option.english,
          arabic: option.arabic
        });
      }
    } else if (this.checkListValue.controls[j].get('checkBoxFlag').value == false) {
      if (this.responseArray[index].bilingualAnswers.length == 1) {
        this.checkListValue.controls[j]?.get('checkBoxFlag').setValue(null);
      }
      const selectedOptionIndex = this.responseArray[index].bilingualAnswers.findIndex(
        ot => ot.english === option.english
      );
      this.responseArray[index].bilingualAnswers.splice(selectedOptionIndex, 1);
    }

    this.setCheckBoxValidity();
    this.surveyRequest = { rating: this.smileName.rating, surveyResponse: this.responseArray };
  }
  getSelectedAnswer(event, question) {
    const index = this.responseArray.findIndex(item => item.questionId == question.questionId);
    if (index === -1) {
      const newPaylad = {
        questionId: question.questionId,
        bilingualAnswers: [
          {
            english: event,
            arabic: event
          }
        ]
      };
      this.responseArray.push(newPaylad);
    } else {
      const response = this.responseArray.find(response => response.questionId == question.questionId);
      response.bilingualAnswers.splice(0, 1);
      this.responseArray[index].bilingualAnswers = [
        {
          english: event,
          arabic: event
        }
      ];
    }
    this.surveyRequest = { rating: this.smileName.rating, surveyResponse: this.responseArray };

    this.setRadioValidity();
  }

  onInputBlur(ques, i) {
    const index = this.responseArray.findIndex(item => item.questionId == ques.questionId);
    if (index == -1) {
      const newPaylad = {
        questionId: ques.questionId,
        bilingualAnswers: [
          {
            english: this.textListValue.controls[i].get('answer').value,
            arabic: this.textListValue.controls[i].get('answer').value
          }
        ]
      };
      this.responseArray.push(newPaylad);
    }

    this.surveyRequest = { rating: this.smileName.rating, surveyResponse: this.responseArray };
    this.setTextBoxValidity();
  }
  submit() {
    if (this.comments.value) {
      const newPaylad = {
        questionId: 9,
        bilingualAnswers: [
          {
            english: this.comments.value,
            arabic: this.comments.value
          }
        ]
      };
      this.responseArray.push(newPaylad);
    }

    this.surveyRequest = { rating: this.smileName.rating, surveyResponse: this.responseArray };
    this.surveySurvice.saveSurveyDetails(this.surveyRequest, this.uuid).subscribe(
      res => {
        this.responseMessage.emit(res);
      },
      error => {
        if (error?.error) {
          this.errorMessage.emit(error.error);
        }
      }
    );
  }
}
