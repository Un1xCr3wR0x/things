/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent, BilingualText, LanguageToken } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ViolationCommitteEnum, ViolationValidatorRoles, ViolationsEnum } from '../../enums';
import { ContributorDetails, ViolationTransaction } from '../../models';

@Component({
  selector: 'vol-excluded-contributor-dc',
  templateUrl: './excluded-contributor-dc.component.html',
  styleUrls: ['./excluded-contributor-dc.component.scss']
})
export class ExcludedContributorDcComponent extends BaseComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */

  commiteeList: [];
  contributorIdList = [];
  currentPage = 1;
  isCommitteHead = false;
  itemsPerPage = 5;
  lang = 'en';
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  noOfRecords: number;
  excludedContributors: ContributorDetails[] = [];
  paginationId = 'excludeContributor';
  //Input variables
  @Input() transactionDetails: ViolationTransaction;
  @Input() totalRecords: number;
  @Input() assigneeIndex:number;
  @Input() isVch:boolean;
  @Input() isViolationTransactionPage:boolean;
  @Output() hide: EventEmitter<null> = new EventEmitter();
  /**
   *
   * @param modalRef
   */
  constructor(private modalRef: BsModalRef, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.excludedContributors = this.transactionDetails.contributors.filter(value => value.excluded === true);
    this.getExcludedContributorsValue();
    this.noOfRecords = this.excludedContributors.length;
  }
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transactionDetails) {
      this.transactionDetails = changes.transactionDetails.currentValue;
      this.getExcludedContributorsValue();
    }
  }
  /**
   * Method to get contributor details
   */
  getExcludedContributorsValue() {
    this.excludedContributors.forEach((excludedValue, e) => {
      this.contributorIdList.push(excludedValue.contributorId);
    });
    this.transactionDetails.penaltyInfo.forEach((penalty, j = 0) => {
      this['marker' + this.absoluteIndex(j)] = [];
      penalty.excludedContributors.forEach(excludedmember => {
        this['marker' + this.absoluteIndex(j)].push(excludedmember.contributorId);
      });
    });
  }

  /**
   * Method to get excluded comitee values
   */
  getExcludedCommitee(c, i) {
    if (this['marker' + c].includes(this.contributorIdList[this.absoluteIndex(i)])) return 1;
    else return 0;
  }

  checkIsExcluded(i) {
    let isexist = 0;
    this.transactionDetails.penaltyInfo.forEach(item => {
      item.excludedContributors.forEach(element => {
        if (element.contributorId === this.excludedContributors[this.absoluteIndex(i)].contributorId) {
          isexist = 1;
        }
      });
    });
    return isexist;
  }
  /**
   * Method to hide modal
   */
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  /**
   * Method to get absolute index
   * @param indexOnPage
   */
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }
  /**
   * Method to select corresponding page
   * @param page
   */
  selectPage(value: number): void {
    if (this.pageDetails.currentPage !== value) this.pageDetails.currentPage = this.currentPage = value;
  }
  /**
   * Method to get the corresponding validator role
   * @param role
   */
  getValidatorRole(role:BilingualText) {
    if (role.english.toUpperCase() === ViolationValidatorRoles.COMMITEE_HEAD.toUpperCase()) {
      return ViolationCommitteEnum.VIOLATION_COMMITTEE_HEAD;
    } else {
      return ViolationCommitteEnum.VIOLATION_COMMITTEE_MEMBER;
    }
  }
  isTooltipNeeded(name: BilingualText) {
    const contributor = name.english === null ? name.arabic : this.lang === 'en' ? name.english : name.arabic;
    switch (this.transactionDetails.penaltyInfo.length) {
      case 1:
        if (contributor.length > ViolationsEnum.ONLY_VC_ONE) return 1;
        else return 0;
      case 2:
        if (contributor.length > ViolationsEnum.BOTH_VCS) return 1;
        else return 0;
      case 3:
        if (contributor.length > ViolationsEnum.ALL_THREE_VC) return 1;
        else return 0;
    }
  }
}
