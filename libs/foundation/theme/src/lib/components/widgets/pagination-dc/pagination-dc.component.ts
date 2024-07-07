/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { LanguageToken, PaginationOutput } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-pagination-dc',
  templateUrl: './pagination-dc.component.html',
  styleUrls: ['./pagination-dc.component.scss']
})
export class PaginationDcComponent implements OnChanges, OnInit {
  private readonly regex: RegExp = new RegExp('^[0-9]*$');
  // Input variable
  @Input() totalSize = 0;
  @Input() itemsPerPage = 10;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  @Input() paginationId: string;
  @Input() itemType: string;

  // Output Variable
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pageOutDetails: PaginationOutput;
  totalPages = Math.floor(this.totalSize / this.itemsPerPage);
  currentPage = this.pageDetails.currentPage;
  goTo = this.pageDetails.goToPage;
  previousPage: number;
  lang = 'en';
  scrHeight: number;
  scrWidth: number;
  isSmallScreen = false;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.getScreenSize();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.pageDetails && changes.pageDetails.currentValue) {
      this.pageDetails = changes.pageDetails.currentValue;
      this.goTo = this.pageDetails.goToPage;
      this.currentPage = this.pageDetails.currentPage;
      // this.pageChanged(this.currentPage);FIXME method triggeres pageChange
    }
    if (changes.totalSize && changes.totalSize.currentValue) this.calTotalPage();
  }
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    this.isSmallScreen = this.scrWidth <= 768 ? true : false;
  }
  goToPage() {
    if (String(this.goTo).match(this.regex)) {
      const number = parseInt(this.goTo, 10);
      this.calTotalPage();
      if (number <= this.totalPages && number > 0) {
        this.currentPage = number === this.totalPages ? this.totalPages : number === 0 ? 0 : number;
        this.pageChanged(this.currentPage);
      } else if (number === 0 && this.currentPage !== 0) {
        this.currentPage = 1;
        this.goTo = '1';
        this.pageChanged(this.currentPage);
      } else if (number > this.totalPages && this.currentPage !== this.totalPages) {
        this.currentPage = this.totalPages;
        this.goTo = String(this.totalPages);
        this.pageChanged(this.currentPage);
      }
    }
  }
  calTotalPage() {
    if (this.totalSize && this.itemsPerPage > 0) {
      this.totalPages = Math.floor(this.totalSize / this.itemsPerPage);
      if (this.totalSize % this.itemsPerPage > 0) {
        this.totalPages++;
      }
    }
  }
  pageChanged(page: number): void {
    this.calTotalPage();
    this.currentPage = page;
    this.goTo = String(page);
    this.pageChange.emit(page);
  }

  resetPage() {
    this.currentPage = this.pageDetails.currentPage = 1;
    this.goTo = this.pageDetails.goToPage;
  }
}
