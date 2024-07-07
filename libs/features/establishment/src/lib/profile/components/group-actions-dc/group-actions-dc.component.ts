/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AppConstants, DropdownItem, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentActionEnum, FilterKeyValue } from '../../../shared';

@Component({
  selector: 'est-group-actions-dc',
  templateUrl: './group-actions-dc.component.html',
  styleUrls: ['./group-actions-dc.component.scss']
})
export class GroupActionsDcComponent implements OnInit {
  @Input() showBranchesHeading: boolean;
  @Input() actionDropDown: DropdownItem[];
  @Input() noOfBranches: number;
  @Input() branchFilters: Array<FilterKeyValue>;
  @Input() isLoading = false;
  @Input() isPpa = false;

  @Output() searchEstablishmentEvent: EventEmitter<number | string> = new EventEmitter();
  @Output() actionType: EventEmitter<EstablishmentActionEnum> = new EventEmitter();
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();

  isArabicScreen: boolean;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      if (lang === 'ar') {
        this.isArabicScreen = true;
      } else {
        this.isArabicScreen = false;
      }
    });
  }

  getGPTLink(): string {
    let link;
    if (this.isArabicScreen) {
      link = AppConstants.ADD_ADMIN_GPT_LINK_AR.match('href="(.*)" target="_blank"');
    } else {
      link = AppConstants.ADD_ADMIN_GPT_LINK_EN.match('href="(.*)" target="_blank"');
    }
    return link[1];
  }
}
