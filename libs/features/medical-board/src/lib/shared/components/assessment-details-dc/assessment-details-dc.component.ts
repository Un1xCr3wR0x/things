import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropdownItem } from '@gosi-ui/core';
import { AssessmentDetailsResponse, DisabiliyDtoList } from '../../models';

@Component({
  selector: 'mb-assessment-details-dc',
  templateUrl: './assessment-details-dc.component.html',
  styleUrls: ['./assessment-details-dc.component.scss']
})
export class AssessmentDetailsDcComponent implements OnInit {
  _lang;
  @Input() assessmentDetails: DisabiliyDtoList;
  @Input() dropdownList: DropdownItem[];
  @Input() public get lang() {
    return this._lang;
  };
  public set lang(lang) {
    this._lang = lang;
    this.onSelectedItem(this.id);
  };

  @Output() selectedItem = new EventEmitter();
  @Output() onLocationChange = new EventEmitter();
  form: FormGroup;
  id: number;
  constructor(readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      participantLocation: ['']
    });
  }
  onSelectedItem(id) {
    this.id = id;
    if(this.form && this.form.get('participantLocation'))
    this.form.get('participantLocation').setValue(this.lang === 'en' ? this.dropdownList[id - 1].value.english : this.dropdownList[id - 1].value.arabic);
    this.selectedItem.emit(id);
  }
}
