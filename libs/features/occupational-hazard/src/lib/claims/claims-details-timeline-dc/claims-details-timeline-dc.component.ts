/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Inject,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { ClaimsWrapper } from '../../shared/models/claims-details';
import { LanguageToken, ApplicationTypeToken, ApplicationTypeEnum, DocumentItem } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Claims } from '../../shared/models/claims-wrapper';

@Component({
  selector: 'oh-claims-details-timeline-dc',
  templateUrl: './claims-details-timeline-dc.component.html',
  styleUrls: ['./claims-details-timeline-dc.component.scss']
})
export class ClaimsDetailsTimelineDcComponent implements OnInit, OnChanges, AfterViewChecked {
  //Local varaibles
  lang = 'en';
  isAppPrivate = false;
  isIndividualApp = false;
  claims: Claims[] = [];
  isReimbPending = false;
  showView = true;
  /**
   * Input variables
   */
  @Input() socialInsuranceNo: number;
  @Input() claimsDetails: ClaimsWrapper;
  @Input() claimBreakUpList: Claims[];
  @Input() showNewClaims = true;
  @Input() registrationNumber: number;
  @Input() injuryId: number;
  @Input() documents: DocumentItem[] = [];
  @Output() upload: EventEmitter<number> = new EventEmitter();
  @Output() navigateToCtbtr: EventEmitter<null> = new EventEmitter();
  @Output() navigateToEst: EventEmitter<null> = new EventEmitter();
  /**
   *
   * @param language
   * @param appToken
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private cdRef: ChangeDetectorRef
  ) {}
  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isIndividualApp = true;
    }
  }
  /**
   * This method is detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.claimsDetails && changes.claimsDetails.currentValue) {
      /*Method to Eliminate duplicates in an array*/
      this.claimsDetails = changes.claimsDetails.currentValue;
    }
  }
  /**
   * Upload Documents
   */
  uploadDocuments(event) {
    this.upload.emit(event);
  }
  /**
   * Update values
   */
  ngAfterViewChecked() {
    if (this.claimsDetails && this.claimsDetails.claims) {
      this.claims = this.claimsDetails.claims.reduce((acc, val) => {
        if (val && val.requestDate) {
          if (!acc.find(el => el.requestDate.hijiri === val.requestDate.hijiri)) {
            if (
              val.reImbId === null ||
              this.isAppPrivate || this.isIndividualApp || 
              (val.reImbId && val.initiatedByEst) ||
              (val.reImbId &&
                !val.initiatedByEst &&
                val.payeeDetails?.payableTo?.english === 'Contributor' &&
                !this.isAppPrivate)
            ) {
              acc.push(val);
            }
          }
          return acc;
        }
      }, []);
    }
    this.cdRef.detectChanges();
  }

  navigateToContributor() {
    this.navigateToCtbtr.emit();
  }

  navigateToEstProfile() {
    this.navigateToEst.emit();
  }
}
