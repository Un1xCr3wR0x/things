import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  Inject,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, BilingualText, LanguageToken, Lov, LovList } from '@gosi-ui/core';
import { DisabiliyDtoList, MedicalBoardService, SpecialtyList } from '@gosi-ui/features/medical-board';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { OhConstants } from '../../../shared';

@Component({
  selector: 'oh-disability-assessment-details-dc',
  templateUrl: './disability-assessment-details-dc.component.html',
  styleUrls: ['./disability-assessment-details-dc.component.scss']
})
export class DisabilityAssessmentDetailsDcComponent implements OnInit, OnChanges {
  @Input() specialtyList: LovList;
  @Input() parentForm: FormGroup;
  @Input() disabilityDetails: DisabiliyDtoList;
  @Input() isReturn: boolean;
  @Input() heirDisabilityAssessment: boolean;
  @Input() showNonOCCDisability: boolean;
  @Input() specialtyArrayCS: SpecialtyList[];
  @Output() specialtyArraylist: EventEmitter<SpecialtyList[]> = new EventEmitter();

  list: Lov;
  lang: string;
  modalRef: BsModalRef;
  specialtyForm: FormGroup;
  attendenceForm: FormGroup;
  yesOrNoList: LovList = new LovList([]);
  ShowSubSpecialtyList: LovList = new LovList([]);
  specialityAlignedList: BilingualText;
  specialtyIndex;
  subSpec: BilingualText[];
  specialtyArray: SpecialtyList[] = [];
  isDisabled = true;
  mainSpecialtyerror = OhConstants.SELECT_MAIN_SPECIALTY();

  constructor(
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly mbService: MedicalBoardService
  ) {}

  ngOnInit(): void {
    this.attendenceForm = this.createAttendenceForm();
    this.specialtyForm = this.createSpecialtyForm();
    this.yesOrNoList = new LovList([
      { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0, code: 1001 },
      { value: { english: 'No', arabic: 'لا' }, sequence: 1, code: 1002 },
      { value: { english: 'Virtual', arabic: 'افتراضي' }, sequence: 2, code: 1003 }
    ]);
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.parentForm) {
      this.parentForm.addControl('disabilityAttendenceForm', this.attendenceForm);
    }
    if (this.parentForm) {
      this.parentForm.addControl('disabilitySpecialtyForm', this.specialtyForm);
    }
    this.ForBindingSpecialty();
    // For binding  Api values in speciality table
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.disabilityDetails && changes.disabilityDetails.currentValue) {
      this.disabilityDetails = changes.disabilityDetails.currentValue;
      this.ForBindingSpecialty();
    }
    if (changes && changes.specialtyArrayCS && changes.specialtyArrayCS.currentValue) {
      this.specialtyArray = this.specialtyArrayCS;
    }
  }
  specialtyModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
    this.specialtyForm.reset();
    this.subSpec = [];
    this.isDisabled = true;
  }

  createSpecialtyForm() {
    return this.fb.group({
      mainSpecialty: [false],
      specialty: this.fb.group({
        arabic: [null],
        english: [null]
      }),
      subSpecialty: this.fb.group({
        arabic: [null],
        english: [null]
      })
    });
  }
  createAttendenceForm() {
    return this.fb.group({
      isParticipantAttendanceRequired: this.fb.group({
        english: ['Yes', { validators: Validators.required }],
        arabic: ['نعم']
      })
    });
  }
  selectYesOrNo() {}
  cancel() {
    this.modalRef.hide();
  }
  // save() {
  //   this.specialtyArray?.push({
  //     specialty: this.specialtyForm.get('specialty').value,
  //     subSpecialty: this.specialtyForm
  //       .get('subSpecialty')
  //       ?.get('english')
  //       ?.value.map(res => {
  //         return {
  //           english: res?.english,
  //           arabic: res?.arabic
  //         };
  //       }),
  //     isMainSpecialty: this.specialtyForm.get('mainSpecialty').value || false
  //   });
  //   this.modalRef.hide();
  //   this.specialtyArraylist.emit(this.specialtyArray);
  // }
  save() {
    if (!this.specialtyArray) {
      this.specialtyArray = [];
    }
    const specialtyValue = this.specialtyForm.get('specialty').value;
    const subSpecialtyValue = this.specialtyForm.get('subSpecialty')?.get('english')?.value;
    const specialtyObject = {
      isMainSpecialty: this.specialtyForm.get('mainSpecialty').value || false,
      specialty: specialtyValue,
      subSpecialty: subSpecialtyValue?.map(res => ({
        arabic: res?.arabic,
        english: res?.english
      }))
    };
    this.specialtyArray.push(specialtyObject);
    this.modalRef.hide();
    this.specialtyArraylist.emit(this.specialtyArray);
  }

  onDeleteField(i: number) {
    this.specialtyArray.splice(i, 1);
    this.specialtyArraylist.emit(this.specialtyArray);
  }
  selectedSpecialty(specialty: Lov) {
    if (specialty === null) {
      this.isDisabled = true;
      this.specialtyForm.get('subSpecialty').reset();
    }
    if (specialty.value.english.length > 1) {
      this.isDisabled = false; // to make button disable
    }
    if (this.specialtyForm.get('specialty').valueChanges) {
      this.specialtyForm.get('subSpecialty').reset();
    }
    this.specialtyIndex = specialty.sequence - 1;
    this.list = this.specialtyList.items[this.specialtyIndex];
  }
  onSelectedSubspecialty(items: BilingualText[]) {
    this.subSpec = items;
  }
  clear() {
    this.specialtyForm.get('subSpecialty').reset();
  }
  /**
   * This method is to reset the values in specialty is removed .
   */
  onChange(event) {
    if (event === undefined) {
      if (this.specialtyForm.value.specialty.english === null) {
        this.subSpec = [];
        this.specialtyForm.reset();
      }
    }
  }
  ForBindingSpecialty() {
    if (
      this.disabilityDetails &&
      this.disabilityDetails.specialtyList &&
      this.disabilityDetails.specialtyList.length > 0
    ) {
      this.specialtyArray = this.disabilityDetails.specialtyList;
      this.mbService.setSpecialityArray(this.specialtyArray);
    }
  }
}
