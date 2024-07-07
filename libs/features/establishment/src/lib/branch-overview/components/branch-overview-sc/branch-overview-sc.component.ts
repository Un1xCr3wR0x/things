/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { EstablishmentBranchWrapper, BranchList } from '../../models';
import { BranchOverviewService } from '../../services/branch-overview.service';

@Component({
  selector: 'est-branch-overview-sc',
  templateUrl: './branch-overview-sc.component.html',
  styleUrls: ['./branch-overview-sc.component.scss']
})
export class BranchOverviewScComponent implements OnInit, AfterViewInit {
  /**
   * Local variables
   */
  establishmentbranches: BranchList[] = [];
  pageNo = 0;
  totalBranchCount = 0;
  minSearchChar = 3;
  establishmentRegNo = 910000101;
  searchFilterTerm = new FormControl('');
  public searchTerm$ = new Subject<string>();
  lang = 'en';
  showSearchBox = false;
  isNomatch = false;
  isLoading = false;
  searchErrormessage = new BilingualText();

  constructor(private branchOverviewService: BranchOverviewService) {}

  /**
   * Onpage load get the list of establishments and subscribe to search event
   */
  ngOnInit() {
    this.getEstablishmentBranches(this.establishmentRegNo, this.pageNo);
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  /**
   * Method to listen to window scroll and if scroll reaches bottom fetch more establishments
   */

  onScroll() {
    this.isLoading = true;
    this.pageNo = this.pageNo + 1;
    this.getEstablishmentBranches(this.establishmentRegNo, this.pageNo);
  }

  onSearch(searchTerm) {
    this.searchFilterTerm.patchValue(searchTerm);
    if (searchTerm.value) {
      this.pageNo = 0;
      this.branchOverviewService
        .establishmentBranches(this.establishmentRegNo, this.pageNo, searchTerm.value)
        .subscribe(
          (res: EstablishmentBranchWrapper) => {
            this.establishmentbranches = [];
            res.branchList.forEach(element => {
              this.establishmentbranches.push(element);
            });
            this.isNomatch = false;
          },
          err => {
            this.isNomatch = true;
            this.searchErrormessage = err.error.message;
          }
        );
    } else {
      this.showSearchBox = false;
    }
  }

  searchKeyUp(searchTerm) {
    this.searchFilterTerm.patchValue(searchTerm);
    of(searchTerm)
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter((query: string) => query && query.length > this.minSearchChar),
        tap(() => (this.pageNo = 0)),
        switchMap(searchTermResponse =>
          this.branchOverviewService.establishmentBranches(this.establishmentRegNo, this.pageNo, searchTermResponse)
        )
      )
      .subscribe(
        (res: EstablishmentBranchWrapper) => {
          this.establishmentbranches = [];
          res.branchList.forEach(element => {
            this.establishmentbranches.push(element);
          });
          this.isNomatch = false;
        },
        err => {
          this.isNomatch = true;
          this.searchErrormessage = err.error.message;
        }
      );
    if (!searchTerm) {
      this.pageNo = 0;
      this.minSearchChar = 3;
      this.establishmentbranches = [];
      this.isNomatch = false;
      this.getEstablishmentBranches(this.establishmentRegNo, this.pageNo);
    }
  }

  /**
   * Method to fetch branch & main establishments on initial page load
   * @param registrationNo
   * @param pageNo
   */

  getEstablishmentBranches(registrationNo: number, pageNo: number) {
    this.branchOverviewService
      .establishmentBranches(registrationNo, pageNo, this.searchFilterTerm.value)
      .pipe(
        tap(
          res =>
            (this.totalBranchCount =
              res.branchStatus.activeEstablishments +
              res.branchStatus.closingInProgress +
              res.branchStatus.openingInProgress)
        )
      )
      .subscribe(
        (res: EstablishmentBranchWrapper) => {
          res.branchList.forEach(element => {
            this.establishmentbranches.push(element);
          });
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }
}
