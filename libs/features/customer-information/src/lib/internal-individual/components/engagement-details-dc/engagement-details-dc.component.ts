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
import { Coverage, EngagementDetails } from '@gosi-ui/foundation-dashboard/src/lib/individual-app/models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cim-engagement-details-dc',
  templateUrl: './engagement-details-dc.component.html',
  styleUrls: ['./engagement-details-dc.component.scss']
})
export class EngagementDetailsDcComponent implements OnInit, OnChanges {
  cov = null;
  annuity = ContributionCategory.ANNUITY;
  oh = ContributionCategory.OH;
  ui = ContributionCategory.UI;
  isNavigate = true;
  @Input() engagementDetails: EngagementDetails[];
  @Input() coverageDetails: CoveragePeriod[] = [];
  @Input() isAppProfile = false;
  @Input() periods: Coverage[] = [];
  @Input() displayIcon = true;
  @Input() lang: string;
  @Input() isTotalShare = false;
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
  modalRef: BsModalRef;
  constructor(readonly modalService: BsModalService) {}
  @HostListener('window:resize', ['$event'])
  onWIndowREsize() {
    this.width = window.innerWidth;
    if (this.width < 1024) {
      this.mobileView = true;
      this.showRight = this.currentIndex < this.engagementDetails?.length - 1 ? true : false;
    } else {
      this.mobileView = false;
      this.showRight = this.currentIndex + 1 < this.engagementDetails.length - 1 ? true : false;
    }
  }
  ngOnInit(): void {
    this.currentIndex = 0;
    this.showLeft = false;
    this.showRight = this.currentIndex + 1 < this.engagementDetails.length - 1 ? true : false;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementDetails = changes.engagementDetails.currentValue;
      this.showRight = this.currentIndex + 1 < this.engagementDetails.length - 1 ? true : false;
      this.setEngagementCoverage();
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

      this.showLeft = this.currentIndex - 2 > 0 ? true : false;

      this.showRight = this.currentIndex < this.engagementDetails.length - 1 ? true : false;
    } else {
      this.currentIndex = this.currentIndex - 3;

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
      this.currentIndex = this.currentIndex + 3;

      this.showLeft = this.currentIndex - 2 > 0 ? true : false;

      this.showRight = this.currentIndex + 2 < this.engagementDetails.length - 1 ? true : false;
    }
  }
  navigateToEngagement() {
    if (this.isNavigate) this.navigate.emit();
  }
  onNavigateTo() {
    this.navigateTo.emit();
  }
  isTooltipNeeded(name: BilingualText) {
    const contributor = name.english === null ? name.arabic : this.lang === 'en' ? name.english : name.arabic;
    if (contributor.length > 25) return 1;
    else return 0;
  }
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    this.isNavigate = false;
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  hideModal() {
    this.modalRef.hide();
    this.isNavigate = true;
  }
}
