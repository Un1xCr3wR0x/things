/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeToken, ApplicationTypeEnum, RouterConstants } from '@gosi-ui/core';

@Component({
  selector: 'dsb-search-tabset-dc',
  templateUrl: './search-tabset-dc.component.html',
  styleUrls: ['./search-tabset-dc.component.scss']
})
export class SearchTabsetDcComponent implements OnInit, AfterViewChecked {
  /*
   * Local variables
   */
  currentTab = 0;
  isPrivate: boolean;
  /**
   *
   * @param router
   * @param appToken
   */
  constructor(
    public router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly cdr: ChangeDetectorRef
  ) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  /**
   * This method is to detect chanes in component views
   */
  ngAfterViewChecked() {
    switch (this.router.url) {
      case RouterConstants.ROUTE_ESTABLISHMENT_SEARCH:
        this.currentTab = 0;
        break;
      case RouterConstants.ROUTE_INDIVIDUAL_SEARCH:
        this.currentTab = 1;
        break;
      case RouterConstants.ROUTE_TRANSACTION_SEARCH:
        this.currentTab = 2;
        break;
    }
    this.cdr.detectChanges();
  }
  /**
   * Method to set selected tab
   * @param tab
   */
  onSelect(tab) {
    this.currentTab = tab;
    switch (tab) {
      case 0:
        this.router.navigate([RouterConstants.ROUTE_ESTABLISHMENT_SEARCH]);
        break;
      case 1:
        this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_SEARCH]);
        break;
      case 2:
        this.router.navigate([RouterConstants.ROUTE_TRANSACTION_SEARCH]);
        break;
    }
  }
}
