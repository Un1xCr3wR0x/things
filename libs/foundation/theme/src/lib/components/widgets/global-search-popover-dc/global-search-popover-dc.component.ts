import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { LanguageToken, SideMenuStateToken, getScreenCoordinates, scrollToPosition } from '@gosi-ui/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'gosi-global-search-popover-dc',
  templateUrl: './global-search-popover-dc.component.html',
  styleUrls: ['./global-search-popover-dc.component.scss']
})
export class GlobalSearchPopoverDcComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('popover') popover: PopoverDirective;
  @ViewChild('popbtn') filterBtnRef: ElementRef;
  @ViewChild('popContent') filterContent: ElementRef;
  /**
   * Input Variables
   */
  @Input() adaptivePosition = false;
  @Input() noScroll = false;
  @Input() filterId: string;
  @Input() isFilterApplied = false;
  @Input() hasFilterParams = false;
  @Input() isDynamicPositionRequired = true;
  @Input() btnOpen = true;
  @Input() isExpand: any;
  @Input() stayFixedOnScreenChange: boolean = false;
  @Input() disallowHeightExpansion: boolean = true;
  /**
   * Output variables
   */
  @Output() apply = new EventEmitter<null>();
  @Output() reset = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();
  @Output() scroll = new EventEmitter<null>();
  /**Local variables */
  isOpen = false;
  lang = 'en';
  placement = 'bottom right';
  width = window.innerWidth;
  filterPositionWidth: number;
  filterPositionWidthRight: number;
  classModal: string;
  expand = false;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(SideMenuStateToken) readonly sideMenu: BehaviorSubject<boolean>,
    readonly cdr: ChangeDetectorRef
  ) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (!this.adaptivePosition) this.resetPopver();
    setTimeout(() => {
      this.resetPopver();
      this.filterPosition();
    }, 500);
  }
  filterPosition() {
    this.language.subscribe(language => {
      this.lang = language;
      if (this.lang == 'en') {
        this.classModal = 'custom-popover';
      } else {
        this.classModal = 'arabic-popover';
      }
      this.width = window.innerWidth;
      if (this.isDynamicPositionRequired) {
        if (this.filterId) {
          this.filterPositionWidth = document?.getElementById(this.filterId)?.getBoundingClientRect().left;
        } else {
          this.filterPositionWidth = document.getElementsByClassName('btn-filter')[0]?.getBoundingClientRect().left;
        }
        if (this.stayFixedOnScreenChange) this.popover?.hide();
        this.filterPositionWidth = this.filterPositionWidth + 40;
        if (this.width && this.filterPositionWidth < this.width / 2) {
          this.placement = 'bottom left';
          if (this.filterPositionWidth === 40 && this.lang === 'ar') {
            this.placement = 'bottom right';
          }
        } else if (this.width && this.filterPositionWidth >= this.width / 2) {
          this.placement = 'bottom right';
        }
      }
      this.cdr.detectChanges();
    });
  }
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
      if (this.lang == 'en') {
        this.classModal = 'custom-popover';
      } else {
        this.classModal = 'arabic-popover';
      }
      this.cdr.detectChanges;
    });
    this.filterPosition();
    if (this.adaptivePosition) this.placement = 'right top';
    if (this.btnOpen) {
      this.popover.hide();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.btnOpen) {
      this.cdr.detectChanges;
      this.popover?.hide();
    }
    if (changes.isExpand) {
      this.expand = changes.isExpand.currentValue;
    }
  }
  ngAfterViewInit() {
    this.language.subscribe(language => {
      this.lang = language;
      if (this.lang == 'en') {
        this.classModal = 'custom-popover';
      } else {
        this.classModal = 'arabic-popover';
      }
      if (!this.adaptivePosition) {
        this.placement = this.lang === 'en' ? 'bottom right' : 'bottom left';
        this.resetPopver();
        setTimeout(() => {
          this.resetPopver();
          this.filterPosition();
        }, 500);
      }
    });
    this.sideMenu.subscribe(() => {
      if (!this.adaptivePosition) {
        this.resetPopver();
        setTimeout(() => {
          this.resetPopver();
          this.filterPosition();
        }, 500);
      }
    });
    this.cdr.detectChanges();
  }
  /**
   * Method to handle show event of the popover
   */
  onShown(): void {
    this.isOpen = true;
    this.appendBodyWithOverflow();
  }
  onFilterClick() {
    if (this.lang == 'en') {
      this.classModal = 'custom-popover';
    } else {
      this.classModal = 'arabic-popover';
    }
    this.filterPosition();
    if (!this.adaptivePosition && !this.isOpen && !this.noScroll && !this.stayFixedOnScreenChange)
      scrollToPosition(0, getScreenCoordinates(this.filterBtnRef.nativeElement).yPos - 50);
  }

  /**
   * Method to handle hide event of the popover
   */
  onHidden(): void {
    this.isOpen = false;
    this.appendBodyWithOverflow();
  }

  /**
   * Method to handle cancel event of the popover
   */
  cancelFilter() {
    this.isOpen = false;
    this.appendBodyWithOverflow();
    this.cancel.emit();
  }

  /**
   * Method to apply filters and emit event to parent component
   */
  applyFilter() {
    this.isOpen = false;
    this.appendBodyWithOverflow();
    this.apply.emit();
  }

  /**
   * Method to reset filters and emit event to parent component
   */
  resetFilter() {
    this.reset.emit();
  }
  /**
   * Method to refresh popover
   */
  resetPopver() {
    if (this.isOpen) {
      this.popover.hide();
      this.popover.delay = 500;
      this.popover.show();
      this.popover.delay = 0;
    }
  }
  /**
   * Method to handle scroll
   */
  onScroll() {
    this.scroll.emit();
  }

  appendBodyWithOverflow() {
    const dom: Element = document.querySelector('body');
    dom.classList.toggle('hide-overflow', this.isOpen);
  }
}


