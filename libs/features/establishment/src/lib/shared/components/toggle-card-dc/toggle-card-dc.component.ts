/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'est-toggle-card-dc',
  templateUrl: './toggle-card-dc.component.html',
  styleUrls: ['./toggle-card-dc.component.scss']
})
export class ToggleCardDcComponent implements OnInit {
  @Input() label: string;
  @Input() formControl: FormControl;
  @Input() toggleDisabled: boolean;

  constructor() {}

  ngOnInit(): void {}
}
