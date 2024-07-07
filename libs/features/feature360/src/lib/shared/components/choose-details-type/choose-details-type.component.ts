import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'fea-choose-details-type',
  templateUrl: './choose-details-type.component.html',
  styleUrls: ['./choose-details-type.component.scss']
})
export class ChooseDetailsTypeComponent implements OnInit {
  detailsTypeForm: FormGroup;
  lang = 'en';

  @Input() currentDetailsTap: string;
  @Input() detailsTypeList: [];

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.detailsTypeForm = this.createDetailsTypeForm();
    this.detailsTypeForm.valueChanges.subscribe(() => {
      this.currentDetailsTap = this.detailsTypeForm.get('organizationCategory').get('english').value;
      this.language.subscribe(language => (this.lang = language));
    });
  }
  createDetailsTypeForm() {
    return this.fb.group({
      organizationCategory: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
    });
  }
}
