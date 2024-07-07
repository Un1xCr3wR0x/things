import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { ChangeMemberDto } from '../../models';

@Component({
  selector: 'mb-change-member-filter-dc',
  templateUrl: './change-member-filter-dc.component.html',
  styleUrls: ['./change-member-filter-dc.component.scss']
})
export class ChangeMemberFilterDcComponent implements OnInit {
  //Input Variable
  @Input() fieldOfficeLists: LovList;
  //Output variable
  @Output() filter: EventEmitter<ChangeMemberDto> = new EventEmitter();
  // Local Variable
  availabilityList: LovList = new LovList([
    { value: { english: 'Available', arabic: 'متوفر' }, sequence: 1 },
    { value: { english: 'Unavailable', arabic: 'غير متوفر' }, sequence: 2 }
  ]);
  locationForm: FormGroup;
  selectedLocationOption: BilingualText[] = [];
  selectedAvailability: BilingualText[] = [];
  locationValues: BilingualText[];
  changeMemberDto: ChangeMemberDto = new ChangeMemberDto();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.locationForm = this.getFieldOfficeForm();
  }
  getFieldOfficeForm(): FormGroup {
    return this.fb.group({
      office: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      availability: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  applyFilter() {
    this.changeMemberDto = this.locationForm.getRawValue();
    this.locationForm?.invalid ? this.clearAllFilter() : null;
    // if (this.selectedLocationOption && this.selectedLocationOption.length >= 1) {
    //   this.locationValues = this.selectedLocationOption;
    // } else {
    //   this.locationValues = null;
    // }
    this.filter.emit(this.changeMemberDto);
  }
  clearAllFilter() {
    this.locationForm.reset();
    this.selectedLocationOption = [];
    this.selectedAvailability = [];
  }
}
