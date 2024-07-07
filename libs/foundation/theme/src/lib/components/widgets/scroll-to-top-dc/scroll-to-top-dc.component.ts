/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, HostListener, OnInit } from '@angular/core';
import { BaseComponent, scrollToTop } from '@gosi-ui/core';

@Component({
  selector: 'gosi-scroll-to-top-dc',
  templateUrl: './scroll-to-top-dc.component.html',
  styleUrls: ['./scroll-to-top-dc.component.scss']
})
export class ScrollToTopDcComponent extends BaseComponent implements OnInit {
  showScroll: boolean;
  showScrollHeight = 100;
  hideScrollHeight = 10;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight) {
      this.showScroll = true;
    } else if (
      this.showScroll &&
      (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight
    ) {
      this.showScroll = false;
    }
  }

  ngOnInit(): void {}

  scrollTop() {
    scrollToTop();
  }
}
