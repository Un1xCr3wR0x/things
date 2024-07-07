import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'oh-disability-description-dc',
  templateUrl: './disability-description-dc.component.html',
  styleUrls: ['./disability-description-dc.component.scss']
})
export class DisabilityDescriptionDcComponent implements OnInit {
  disabilityDescriptionForm: FormGroup;
  disabilityMaxLength = 1500;
  @Input() parentForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
