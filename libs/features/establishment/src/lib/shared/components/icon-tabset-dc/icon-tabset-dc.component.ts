/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DropdownItem } from '@gosi-ui/core';

@Component({
  selector: 'est-icon-tabset-dc',
  templateUrl: './icon-tabset-dc.component.html',
  styleUrls: ['./icon-tabset-dc.component.scss']
})
export class IconTabsetDcComponent implements OnInit {
  @Input() tabs: DropdownItem[];
  @Input() selectedTab: string;

  @Output() selectTab: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
