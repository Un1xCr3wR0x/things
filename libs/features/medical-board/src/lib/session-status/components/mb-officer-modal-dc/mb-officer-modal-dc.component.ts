import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ChangeMemberDto, MBODetailList, MbOfficerDetails, SessionLimitRequest } from '../../../shared';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';

@Component({
  selector: 'mb-mb-officer-modal-dc',
  templateUrl: './mb-officer-modal-dc.component.html',
  styleUrls: ['./mb-officer-modal-dc.component.scss']
})
export class MbOfficerModalDcComponent implements OnInit, OnChanges {
  // Local Variable
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  mbOfficerForm: FormArray = new FormArray([]);
  //Input Variable
  @Input() totalCount: number;
  @Input() mbOfficerList: MBODetailList;
  @Input() limit: SessionLimitRequest = new SessionLimitRequest();
  @Input() fieldOfficeLists: LovList;
  @Output() selectPageNo: EventEmitter<SessionLimitRequest> = new EventEmitter();
  @Output() cancelMbo = new EventEmitter();
  @Output() selectedMbo: EventEmitter<MbOfficerDetails> = new EventEmitter();
  @Output() nationalId: EventEmitter<number> = new EventEmitter();
  @Output() inputText: EventEmitter<number | string> = new EventEmitter();
  @Output() filtered: EventEmitter<ChangeMemberDto> = new EventEmitter();
  @Input() primaryMBOfficer = false;
  // local Variable
  selectedData: MbOfficerDetails;
  mboList: LovList = new LovList([]);
  submitEnable = false;

  constructor(readonly fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.totalCount && changes?.totalCount?.currentValue) {
      this.totalCount = changes?.totalCount?.currentValue;
    }
    if (changes && changes?.mbOfficerList && changes?.mbOfficerList?.currentValue) {
      this.mbOfficerList = changes?.mbOfficerList?.currentValue;
    }
  }
  ngOnInit(): void {
    this.getRadioArrayValues();
    this.mboList = new LovList([
      {
        sequence: 1,
        code: 1001,
        value: new BilingualText()
      }
    ]);
  }
  onSelectPage(page: number) {
    if (page - 1 !== this.limit.pageNo) {
      this.limit.pageNo = page - 1;
      this.pageDetails.currentPage = page;
      this.selectPageNo.emit(this.limit);
    }
  }
  createRadioForm() {
    return this.fb.group({
      flag: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  selectedMBO(value,mbOfficer, index) {
    this.mbOfficerForm?.controls.forEach((data, Y) => {
      Y === index ? data.get('flag')?.get('english').setValue(value) : data.get('flag').get('english').reset();
    });
    this.selectedData = mbOfficer;
    // this.mbOfficerList.mbOfficerList[index];
    this.selectedData ? (this.submitEnable = true) : (this.submitEnable = false);
  }
  getRadioArrayValues() {
    // for (let item of this.mbOfficerList.mbOfficerList) {
    //   this.mbOfficerForm.push(this.createRadioForm());
    // }
    if (this.mbOfficerList && this.mbOfficerList.mbOfficerList.length > 0) {
      this.mbOfficerList.mbOfficerList.forEach(() => {
        this.mbOfficerForm.push(this.createRadioForm());
      });
    }
    // for (let i = 0; i < this.mbOfficerList.mbOfficerList.length; i++) {
    //   this.mbOfficerForm.push(this.createRadioForm());
    // }
  }
  saveMBO() {
    this.selectedMbo.emit(this.selectedData);
  }
  navigateMemberProfile(nationalId) {
    this.nationalId.emit(nationalId);
  }
  onSearchValue(value) {
    this.inputText.emit(value);
  }
  filterArray(value: ChangeMemberDto) {
    this.filtered.emit(value);
  }
}
