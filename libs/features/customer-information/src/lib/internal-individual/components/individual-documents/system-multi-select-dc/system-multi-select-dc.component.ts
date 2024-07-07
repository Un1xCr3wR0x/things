import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'cim-system-multi-select-dc',
  templateUrl: './system-multi-select-dc.component.html',
  styleUrls: ['./system-multi-select-dc.component.scss']
})
export class SystemMultiSelectDcComponent {
  isDisabled: boolean = false;
  /**Input variables */
  @Input() options: Array<BilingualText>;
  @Input() control: FormGroup;
  /**Output variables */
  @Output() check: EventEmitter<BilingualText> = new EventEmitter();

  constructor() {}

  getSelectedOptions() {
    //emit array of option checked
    const selectedOrderIds = this.control.value.items
      .map((v, i) => (v ? this.options[i] : null))
      .filter(v => v !== null);
    this.check.emit(selectedOrderIds);
    if (selectedOrderIds.length > 0){
      this.isDisabled = true;
      this.formData.controls.forEach(control => control.disable());
    }
  }
  get formData() {
    return <FormArray>this.control.get('items');
  }
}

