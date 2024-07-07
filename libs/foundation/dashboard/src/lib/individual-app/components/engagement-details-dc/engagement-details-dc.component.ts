import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BilingualText, DropdownItem } from '@gosi-ui/core';
import { ContributionCategory, CoveragePeriod } from '@gosi-ui/features/contributor';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EngagementDetails } from '../../models';
import { Coverage } from '../../models/coverage-period';

@Component({
  selector: 'dsb-engagement-details-dc',
  templateUrl: './engagement-details-dc.component.html',
  styleUrls: ['./engagement-details-dc.component.scss']
})
export class EngagementDetailsDcComponent implements OnInit, OnChanges {
  cov = null;
  annuity = ContributionCategory.ANNUITY;
  oh = ContributionCategory.OH;
  pensionReformAnnuity = ContributionCategory.PENSION_REFORM_ANNUITY;
  ui = ContributionCategory.UI;
  ppa = ContributionCategory.PPA;
  isNavigate = true;
  imageClick = false;
  showCarouselLeft: boolean;
  showCarouselRight: boolean;
  cardCount: number;
  engagementDetailsCarouselList: EngagementDetails[] = [];
  @Input() engagementDetails: EngagementDetails[];
  @Input() coverageDetails: CoveragePeriod[] = [];
  @Input() isAppProfile = false;
  @Input() periods: Coverage[] = [];
  @Input() displayIcon = true;
  @Input() lang = 'en';
  @Input() isTotalShare = false;
  @Input() showEngHistory = false;
  @Output() close = new EventEmitter();
  @Input() isAppIndividual = false;
  @Input() actionDropDown: Array<DropdownItem> = [
    {
      id: 1,
      icon: 'building',
      value: {
        english: 'View Details',
        arabic: ''
      }
    },
    {
      id: 2,
      icon: 'pencil-alt',
      value: {
        english: 'Modify Benefit',
        arabic: ''
      }
    }
  ];
  @Output() actionType: EventEmitter<string> = new EventEmitter();
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  @ViewChild('widgetsContent') widgetsContent: ElementRef;

  @Output() navigateTo: EventEmitter<null> = new EventEmitter();
  currentIndex: number;
  showLeft: boolean;
  showRight: boolean;
  width: number;
  isAdded = true;
  mobileView = false;
  prevCardCount: number = 0;
  modalRef: BsModalRef;
  mobilewidth: boolean;
  constructor(readonly modalService: BsModalService) {}
  @HostListener('window:resize', ['$event'])
  onWIndowREsize() {
    this.width = window.innerWidth;
    this.prevCardCount = this.cardCount;
    if (this.width < 972) {
      this.cardCount = 1;
      if (this.prevCardCount != this.cardCount) {
        this.redrawCarousal();
      }
    } else {
      if (this.width < 1348) {
        this.cardCount = 2;
        if (this.prevCardCount != this.cardCount) {
          this.redrawCarousal();
        }
      } else {
        this.cardCount = this.isAppIndividual ? 3 : 2;
        if (this.prevCardCount != this.cardCount) {
          this.redrawCarousal();
        }
      }
    }
    this.mobilewidth = this.width < 767 ? true : false;

    if (this.width == 820) {
      this.mobileView = false;
    }
    if (this.width < 1000) {
      setTimeout(() => {
        this.mobileView = true;
        this.showRight = this.currentIndex < this.engagementDetails?.length - 1 ? true : false;
      }, 1000);
    } else {
      this.mobileView = false;
      this.showRight = this.currentIndex + 2 < this.engagementDetails?.length - 1 ? true : false;
    }
  }
  ngOnInit(): void {
    this.currentIndex = 0;
    this.showLeft = false;
    this.showCarouselLeft = false;
    // this.width = window.innerWidth;
    this.onWIndowREsize();
  }

  imageClicked() {
    this.imageClick = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.onWIndowREsize();
      this.engagementDetails = changes.engagementDetails.currentValue;
      this.showRight = this.currentIndex + 2 < this.engagementDetails.length - 1 ? true : false;
      this.setEngagementCoverage();
      this.engagementDetailsCarouselList = this.engagementDetails.slice(0, this.cardCount);
      this.showCarouselRight = this.engagementDetails.length > this.cardCount ? true : false;
    }
    if (changes && changes.periods) this.periods = changes.periods.currentValue;
  }
  setEngagementCoverage() {
    this.engagementDetails.forEach(engagement => {
      engagement.engagementPeriod.forEach(val => {
        if (val.id === engagement.engagementId) {
          engagement.actualEngagementPeriod = val;
        }
      });
    });
  }
  onLeftClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex - 1;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight = this.currentIndex < this.engagementDetails.length - 1 ? true : false;
    } else {
      this.currentIndex = this.isAppProfile ? this.currentIndex - 2 : this.currentIndex - 3;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight = this.currentIndex + 2 < this.engagementDetails.length - 1 ? true : false;
    }
  }

  onRightClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex + 1;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight = this.currentIndex < this.engagementDetails.length - 1 ? true : false;
    } else {
      this.currentIndex = this.isAppProfile ? this.currentIndex + 2 : this.currentIndex + 3;

      this.showLeft = this.isAppProfile
        ? this.currentIndex - 1 > 0
          ? true
          : false
        : this.currentIndex - 2 > 0
        ? true
        : false;

      this.showRight =
        (this.isAppProfile ? this.currentIndex + 1 : this.currentIndex + 2) < this.engagementDetails.length - 1
          ? true
          : false;
    }
  }
  onCarouselLeftClick() {
    this.currentIndex -= this.cardCount;
    if (this.currentIndex == 0) {
      this.showCarouselLeft = false;
    } else {
      this.showCarouselLeft = true;
    }
    this.engagementDetailsCarouselList = [];
    this.engagementDetailsCarouselList = this.engagementDetails?.slice(
      this.currentIndex,
      this.currentIndex + this.cardCount
    );
    if (
      this.engagementDetailsCarouselList?.length !== this.cardCount ||
      this.engagementDetails?.length - this.cardCount == this.currentIndex
    ) {
      this.showCarouselRight = false;
    } else {
      this.showCarouselRight = true;
    }
  }
  onCarouselRightClick() {
    this.currentIndex += this.cardCount;
    if (this.currentIndex == 0) {
      this.showCarouselLeft = false;
    } else {
      this.showCarouselLeft = true;
    }
    this.engagementDetailsCarouselList = [];
    this.engagementDetailsCarouselList = this.engagementDetails?.slice(
      this.currentIndex,
      this.currentIndex + this.cardCount
    );
    if (
      this.engagementDetailsCarouselList?.length !== this.cardCount ||
      this.engagementDetails?.length - this.cardCount == this.currentIndex
    ) {
      this.showCarouselRight = false;
    } else {
      this.showCarouselRight = true;
    }
  }
  redrawCarousal() {
    this.currentIndex = 0;
    if (this.currentIndex == 0) {
      this.showCarouselLeft = false;
    } else {
      this.showCarouselLeft = true;
    }
    this.engagementDetailsCarouselList = [];
    this.engagementDetailsCarouselList = this.engagementDetails?.slice(
      this.currentIndex,
      this.currentIndex + this.cardCount
    );
    if (
      this.engagementDetailsCarouselList?.length !== this.cardCount ||
      this.engagementDetails?.length - this.cardCount == this.currentIndex
    ) {
      this.showCarouselRight = false;
    } else {
      this.showCarouselRight = true;
    }
  }
  navigateToEngagement() {
    if (this.imageClick != true) {
      if (this.isNavigate) this.navigate.emit();
    }
    this.imageClick = false;
  }
  onNavigateTo() {
    this.navigateTo.emit();
  }
  isTooltipNeeded(name: BilingualText) {
    const contributor = name?.english === null ? name?.arabic : this.lang === 'en' ? name?.english : name?.arabic;
    if (contributor?.length > 25) return 1;
    else return 0;
  }
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    if (this.width == 1024) {
      size = 'md';
    }
    this.isNavigate = false;
    const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  hideModal() {
    this.modalRef.hide();
    this.isNavigate = true;
  }
}
