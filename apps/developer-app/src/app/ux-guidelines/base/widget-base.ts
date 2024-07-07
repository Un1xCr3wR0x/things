import { Directive } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LovList } from '@gosi-ui/core';
import { StateService } from '../services/state.service';

@Directive()
export abstract class WidgetBase {
  control: FormControl = new FormControl(null, { updateOn: 'blur' });
  isdControl: FormControl = new FormControl('sa', { updateOn: 'blur' });
  required = false;
  disabled = false;
  bilingualControl: FormGroup = new FormGroup({
    english: new FormControl(null, Validators.required),
    arabic: new FormControl()
  });
  lovlist: LovList = {
    items: [
      {
        value: { english: 'Dropdown Item One', arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: 'Dropdown Item Two', arabic: 'لا' },
        sequence: 2
      },
      {
        value: { english: 'Dropdown Item Three', arabic: 'لا' },
        sequence: 3
      }
    ]
  };
  button_types: LovList = {
    items: [
      {
        value: { english: 'primary', arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: 'secondary', arabic: 'لا' },
        sequence: 2
      },
      {
        value: { english: 'danger', arabic: 'لا' },
        sequence: 3
      }
    ]
  };

  constructor(state: StateService) {
    state.hasFullWidth = false;
    state.hasToggle$.next(true);
    state.hasDisable$.next(true);
    state.required$.subscribe(res => {
      if (res === false) {
        this.control.clearValidators();
        this.bilingualControl.get('english').clearValidators();
      } else {
        this.control.setValidators(Validators.required);
        this.bilingualControl.get('english').setValidators(Validators.required);
      }
      this.control.markAsPristine();
      this.control.markAsUntouched();
      this.bilingualControl.get('english').markAsPristine();
      this.bilingualControl.get('english').markAsUntouched();
      this.control.updateValueAndValidity();
      this.bilingualControl.get('english').updateValueAndValidity();
    });
    state.disabled$.subscribe(res => {
      this.disabled = res;
      this.control.markAsPristine();
      this.bilingualControl.markAsPristine();
      this.control.markAsUntouched();
      this.bilingualControl.markAsUntouched();
    });
  }
}
