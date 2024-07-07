import { Component, OnInit } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'dev-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  statusList: BilingualText[] = [
    { arabic: 'Completed', english: 'Completed' },
    { arabic: 'Pending', english: 'Pending' },
    { arabic: 'Returned', english: 'Returned' },
    { arabic: 'Reassigned', english: 'Reassigned' }
  ];
  selectedOptions: BilingualText[] = [];
  statusFilterForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const items = ['ط', 'ب', 'ه', 'س', 'ج', 'أ'];
    items.sort((a, b) => a.localeCompare(b, 'ar', { ignorePunctuation: true }));

    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.statusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
  }

  reset() {
    this.statusFilterForm.reset();
  }
  applyFilter() {}
}
