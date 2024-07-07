/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BankAccount, BilingualText, LanguageToken } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Clauses, EngagementDetails, Establishment } from '../../../models';
import { PreviewDcHelper } from './preview-dc-helper';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-preview-dc',
  templateUrl: './preview-dc.component.html',
  styleUrls: ['./preview-dc.component.scss']
})
export class PreviewDcComponent extends PreviewDcHelper implements OnInit, OnChanges {
  @Input() activeEngagement: EngagementDetails;
  @Input() bankInfo: BankAccount;
  @Input() contractAtDraft;
  @Input() contractClausesList: Clauses[];
  @Input() establishment: Establishment;
  @Input() isPreviewEdit: boolean;
  @Input() personDetails;
  @Input() transportationAllowance;
  @Input() isRegistration = false; // to indicate the preview is part of register contributor.
  @Input() canEditSecondParty = false; // second party is editable only if contact details are editable in person details tab.
  @Input() isEditMode: boolean;
  @Input() isApiTriggered: boolean;
  @Input() individualApp? = false;

  @Output() onClausesEdit: EventEmitter<null> = new EventEmitter();
  @Output() onContractDetails: EventEmitter<null> = new EventEmitter();
  @Output() onSubmitClicked: EventEmitter<null> = new EventEmitter();
  @Output() onPreviousClicked: EventEmitter<null> = new EventEmitter();
  @Output() onSecondPartyEdit: EventEmitter<null> = new EventEmitter();
  @Output() onWageEdit: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  arabicNumeral = ['۱', '۲', '۳', '٤', '۵', '٦', '۷', '۸', '۹', '١٠'];
  agreementPartyHeading: BilingualText;
  generalTermsConditionHeading: BilingualText;
  firstParty;
  secondParty;
  jobTitle;
  contractPeriod;
  fromApi;
  monthBilingual;
  yearBilingual;
  probationaryPeriod;
  workingDays;
  annualLeave;
  instruction;
  wageBenefits;
  bankAccount;
  firstObligation;
  secondObligation;
  generalProvision;
  optionalTerms;
  additionalTerms;
  toggleForm: FormGroup;
  viewMode: any;
  isEnglish = false;
  isArabic = false;
  lang: any;
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) private language: BehaviorSubject<string>) {
    super();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contractAtDraft && changes.contractAtDraft.currentValue && this.fromApi) {
      this.getContractFields();
      this.getContractInformationClauses();
      this.getContractClauses();
    }
    if (
      changes &&
      changes.contractClausesList &&
      changes.contractClausesList.currentValue &&
      this.fromApi &&
      this.contractClausesList.length > 0
    ) {
      this.getContractClauses();
      this.getContractInformationClauses();
      this.getOptionalAdditionalValues();
    }
  }
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;

      this.lang === 'en' ? (this.viewMode = 'english') : (this.viewMode = 'arabic');
      if (this.viewMode === 'english') {
        this.isEnglish = true;
        this.isArabic = false;
      } else {
        this.isArabic = true;
        this.isEnglish = false;
      }
    });
    this.agreementPartyHeading = this.getBilingualText('Unified Employment Contract', 'عقد العمل الموحد');
    this.generalTermsConditionHeading = this.getBilingualText('Contract Terms', 'بنود العقد');
    this.firstParty = {
      table: 'firstParty',
      colGrid: 4,
      heading: {
        english: "First Party's Information",
        arabic: 'بيانات الطرف الأول'
      }
    };
    this.secondParty = {
      table: 'secondParty',
      colGrid: 4,
      heading: {
        english: "Second Party's Information",
        arabic: 'بيانات الطرف الثاني'
      },
      canEdit: this.canEditSecondParty
    };
    this.jobTitle = {
      table: 'jobTitle',
      canEdit: this.isPreviewEdit,
      colGrid: 4,
      heading: {
        english: "1. Job's Title & Work's Location",
        arabic: '1.' + ' المهنة ومكان العمل'
      }
    };
    this.contractPeriod = {
      table: 'contractPeriod',
      canEdit: this.isPreviewEdit,
      colGrid: 2,
      heading: {
        english: "2. Contract's Period",
        arabic: '2. ' + ' مدة العقد'
      },
      grids: []
    };
    this.probationaryPeriod = {
      table: 'probationPeriod',
      canEdit: this.isPreviewEdit,
      colGrid: 2,
      heading: {
        english: '3. Probationary Period',
        arabic: '3.' + ' فترة التجربة'
      },
      grids: []
    };
    this.getContractFields();
    this.getOptionalAdditionalTerms();
    this.fromApi = {
      contractPeriod: [],
      probationaryPeriod: [],
      workingDays: [],
      annualLeave: [],
      firstObligation: [],
      secondObligation: [],
      generalProvision: [],
      optionalTerms: [],
      additionalTerms: [],
      instruction: []
    };
    if (this.contractClausesList) {
      this.getContractInformationClauses();
      this.getContractClauses();
      this.getOptionalAdditionalValues();
    }
  }
  /** Method to get optional additional terms */
  getOptionalAdditionalTerms() {
    this.optionalTerms = {
      table: 'optionalTerms',
      canEdit: this.isPreviewEdit,
      colGrid: 2,
      heading: {
        english: 'Optional Terms',
        arabic: 'بنود اختيارية'
      },
      grids: []
    };
    this.additionalTerms = {
      table: 'additionalTerms',
      canEdit: this.isPreviewEdit,
      colGrid: 2,
      heading: {
        english: 'Additional Terms',
        arabic: 'بنود إضافية'
      },
      grids: []
    };
  }
  /** Method to get contract fields */
  getContractFields() {
    this.workingDays = {
      table: 'workingDays',
      canEdit: this.isPreviewEdit,
      colGrid: 2,
      heading: {
        english: this.getNumberByPeriod(4) + '. Work Hours & Weekly Rest',
        arabic: `${this.getNumberByPeriod(4)}. ساعات العمل والراحة الأسبوعية`
      },
      grids: []
    };
    this.annualLeave = {
      table: 'annualLeave',
      canEdit: this.isPreviewEdit,
      colGrid: 2,
      heading: {
        english: this.getNumberByPeriod(5) + '. Annual Leave',
        arabic: `${this.getNumberByPeriod(5)}. الإجازات السنوية`
      },
      grids: []
    };
    this.wageBenefits = {
      table: 'wageBenefits',
      colGrid: 4,
      heading: {
        english: this.getNumberByPeriod(6) + '. Wage & Financial Benefits',
        arabic: `${this.getNumberByPeriod(6)}. الأجر والمزايا المالية`
      },
      canEdit: this.isRegistration
    };
    this.bankAccount = {
      table: 'bankAccount',
      canEdit: !this.isEditMode && this.isPreviewEdit,
      colGrid: 4,
      heading: {
        english: this.getNumberByPeriod(7) + ". Second Party's Bank Account Information ",
        arabic: `${this.getNumberByPeriod(7)}. معلومات الحساب البنكي للطرف الثاني`
      }
    };
    this.firstObligation = {
      table: 'firstObligation',
      colGrid: 2,
      cardIndex: this.getNumberByBank(8),
      heading: {
        english: this.getNumberByBank(8) + ". First Party's Obligations",
        arabic: `${this.getNumberByBank(8)}. التزامات الطرف الأول`
      },
      grids: []
    };
    this.secondObligation = {
      table: 'secondObligation',
      colGrid: 2,
      cardIndex: this.getNumberByBank(9),
      heading: {
        english: this.getNumberByBank(9) + ". Second Party's Obligations",
        arabic: `${this.getNumberByBank(9)}. التزامات الطرف الثاني`
      },
      grids: []
    };
    this.generalProvision = {
      table: 'generalProvision',
      colGrid: 2,
      cardIndex: this.getNumberByBank(10),
      heading: {
        english: this.getNumberByBank(10) + '. General Provisions',
        arabic: `${this.getNumberByBank(10)}. أحكام عامة`
      },
      grids: []
    };
    this.instruction = {
      table: 'instruction',
      canEdit: this.isPreviewEdit,
      colGrid: 2,
      heading: {
        english: this.getNumberByBank(11) + '. Instruction',
        arabic: `${this.getNumberByBank(11)}. تعليمات`
      },
      grids: []
    };
  }
  /** Method to get Bilingual Text
   * @param english
   * @param arabic
   */
  getBilingualText(english: string, arabic: string) {
    return { english: english, arabic: arabic };
  }
  /** Method to final submit contract  */
  saveContractDetails() {
    this.onSubmitClicked.emit();
  }
  /** Method to reach previous tab*/
  navigateTopreviousTab() {
    this.onPreviousClicked.emit();
  }
  /** Method to edit preview section */
  editPreview(table) {
    switch (table) {
      case 'wageBenefits':
        this.onWageEdit.emit();
        break;
      case 'secondParty':
        this.onSecondPartyEdit.emit();
        break;
      case 'jobTitle':
      case 'bankAccount':
      case 'contractPeriod':
      case 'probationPeriod':
      case 'workingDays':
      case 'instruction':
      case 'annualLeave':
        this.onContractDetails.emit();
        break;
      case 'firstObligation':
      case 'secondObligation':
      case 'generalProvision':
      case 'optionalTerms':
      case 'additionalTerms':
        this.onClausesEdit.emit();
    }
  }
  /** Method to get contract information clauses */
  getContractInformationClauses() {
    if (this.contractClausesList) {
      this.fromApi.contractPeriod = this.contractClausesList
        .filter(contract => contract['section']['english'] === 'Contract Period')[0]
        ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .map(section => section['description']);
      Object.keys(this.fromApi.contractPeriod).forEach((key, index) => {
        this.contractPeriod.grids[index] = this.fromApi.contractPeriod[key];
      });
      if (
        this.contractClausesList.filter(contract => contract['section']['english'] === 'Probationary Period')[0]
          ?.clauses.length > 0
      ) {
        this.fromApi.probationaryPeriod = this.contractClausesList
          .filter(contract => contract['section']['english'] === 'Probationary Period')[0]
          ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
          .map(section => section['description']);
        Object.keys(this.fromApi.probationaryPeriod).forEach((key, index) => {
          this.probationaryPeriod.grids[index] = this.fromApi.probationaryPeriod[key];
        });
      }
      this.fromApi.workingDays = this.contractClausesList
        .filter(contract => contract['section']['english'] === 'Work Hours & Weekly Rest')[0]
        ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .map(section => section['description']);
      Object.keys(this.fromApi.workingDays).forEach((key, index) => {
        this.workingDays.grids[index] = this.fromApi.workingDays[key];
      });
      this.fromApi.annualLeave = this.contractClausesList
        .filter(contract => contract['section']['english'] === 'Annual Leave')[0]
        ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .map(section => section['description']);
      Object.keys(this.fromApi.annualLeave).forEach((key, index) => {
        this.annualLeave.grids[index] = this.fromApi.annualLeave[key];
      });

      if (
        this.contractClausesList.filter(contract => contract['section']['english'] === 'Instruction')[0]?.clauses
          .length > 0
      ) {
        this.fromApi.instruction = this.contractClausesList
          .filter(contract => contract['section']['english'] === 'Instruction')[0]
          ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
          .map(section => section['description']);
        Object.keys(this.fromApi.instruction).forEach((key, index) => {
          this.instruction.grids[index] = this.fromApi.instruction[key];
        });
      }
    }
  }
  /** Method to get End date */
  getEndDate() {
    return this.contractAtDraft?.dateFormat === 'G'
      ? moment(this.contractAtDraft?.endDate?.gregorian).format('DD/MM/YYYY')
      : this.contractAtDraft?.endDate?.hijiri;
  }
  /** Method to get start Date */
  getStartDate() {
    return this.contractAtDraft?.dateFormat === 'G'
      ? moment(this.contractAtDraft?.startDate?.gregorian).format('DD/MM/YYYY')
      : this.contractAtDraft?.startDate?.hijiri;
  }
  /** Method to get day by date */
  getDayByDate() {
    return this.contractAtDraft?.dateFormat === 'G'
      ? moment(this.contractAtDraft?.startDate?.gregorian).format('dddd')
      : moment(this.contractAtDraft?.startDate?.hijri).format('dddd');
  }
  /** Method to get contract clauses */
  getContractClauses() {
    if (this.contractClausesList) {
      this.fromApi.firstObligation = this.contractClausesList
        .filter(contract => contract['section']['english'] === "First Party's Obligations")[0]
        ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .map(section => section['description']);
      Object.keys(this.fromApi.firstObligation).forEach((key, index) => {
        this.firstObligation.grids[index] = this.fromApi.firstObligation[key];
      });
      this.fromApi.secondObligation = this.contractClausesList
        .filter(contract => contract['section']['english'] === "Second Party's Obligations")[0]
        ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .map(section => section['description']);
      Object.keys(this.fromApi.secondObligation).forEach((key, index) => {
        this.secondObligation.grids[index] = this.fromApi.secondObligation[key];
      });
      this.fromApi.generalProvision = this.contractClausesList
        .filter(contract => contract['section']['english'] === 'General Provisions')[0]
        ['clauses'].sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .map(section => section['description']);
      Object.keys(this.fromApi.generalProvision).forEach((key, index) => {
        this.generalProvision.grids[index] = this.fromApi.generalProvision[key];
      });
    }
  }
  /** Method to get optional additional Terms */
  getOptionalAdditionalValues() {
    this.getOptionalAdditionalTerms();
    if (
      this.contractClausesList.filter(contract => contract['section']['english'] === 'Optional Clauses')[0]?.clauses
        .length > 0 &&
      this.contractClausesList
        .filter(contract => contract['section']['english'] === 'Optional Clauses')[0]
        ['clauses'].filter(clause => clause['isChecked'][0])
    ) {
      this.fromApi.optionalTerms = this.contractClausesList
        .filter(contract => contract['section']['english'] === 'Optional Clauses')[0]
        ['clauses'].filter(clause => clause['isChecked'])
        .sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10))
        .map(section => {
          if (section['description']['english'] || section['description']['arabic']) {
            return section['description'];
          }
        });
      if (this.fromApi?.optionalTerms?.length > 0) {
        Object.keys(this.fromApi.optionalTerms).forEach((key, index) => {
          this.optionalTerms.grids[index] = this.fromApi.optionalTerms[key];
        });
      }
    } else {
      this.optionalTerms.grids = [];
    }
    if (this.contractClausesList.filter(contract => contract['section']['english'] === 'Additional Clauses')[0]) {
      this.fromApi.additionalTerms = this.contractClausesList
        .filter(contract => contract['section']['english'] === 'Additional Clauses')[0]
        ['clauses'].map(section => {
          if (section['description']['english'] || section['description']['arabic']) {
            return section['description'];
          }
        });
      Object.keys(this.fromApi.additionalTerms).forEach((key, index) => {
        this.additionalTerms.grids[index] = this.fromApi.additionalTerms[key];
      });
    } else {
      this.additionalTerms.grids = [];
    }
  }
  /** Method to get Number by probationary period */
  getNumberByPeriod(index) {
    if (this.contractAtDraft?.workDetails?.probationPeriodInDays) {
      return index;
    } else {
      return index - 1;
    }
  }
  /** Method to get Number by probationary period and bank details*/
  getNumberByBank(index) {
    if (!this.contractAtDraft?.workDetails?.probationPeriodInDays && !this.bankInfo?.ibanAccountNo) {
      return index - 2;
    } else if (!this.contractAtDraft?.workDetails?.probationPeriodInDays || !this.bankInfo?.ibanAccountNo) {
      return index - 1;
    } else {
      return index;
    }
  }
  /** Method to get arabic Numeral by probationary period */
  getArabicNumberalByPeriod(index) {
    if (this.contractAtDraft?.workDetails?.probationPeriodInDays) {
      return this.arabicNumeral[index - 1];
    } else {
      return this.arabicNumeral[index - 2];
    }
  }

  /**
   * This method is to cansel current transaction
   * @memberof contract-form-c
   */
  cancelForm() {
    this.cancel.emit();
  }
  /**
   * create toggle form
   */
  createToggleForm() {
    if (!this.toggleForm) {
      return this.fb.group({
        toggle: ['']
      });
    }
  }
  /**
   * check toggle change
   */

  contributionViewChange(res) {
    if (res === 'arabic') {
      this.viewMode = res;
      this.isArabic = true;
      this.isEnglish = false;
    } else if (res === 'english') {
      this.viewMode = res;
      this.isEnglish = true;
      this.isArabic = false;
    }
  }
}
