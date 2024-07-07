/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { getScreenCoordinates, LanguageToken, scrollToPosition, SideMenuStateToken } from '@gosi-ui/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-filter-dc',
  templateUrl: './filter-dc.component.html',
  styleUrls: ['./filter-dc.component.scss']
})
export class FilterDcComponent implements AfterViewInit, OnInit {
  @ViewChild('popover') popover: PopoverDirective;
  @ViewChild('filterbtn') filterBtnRef: ElementRef;
  @ViewChild('filterContent') filterContent: ElementRef;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;
  /**
   * Input Variables
   */
  @Input() adaptivePosition = false;
  @Input() noScroll = false;
  @Input() filterId: string;
  @Input() isFilterApplied = false;
  @Input() hasFilterParams = false;
  @Input() isDynamicPositionRequired = true;
  @Input() isOnModal = false;
  @Input() outsideClick = false;
  @Input() insideEvent = false;
  @Input() closeEvent = false;
  @Input() clearbutton = false;
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

  @HostListener('document:click', ['$event.target'])
  docClicked(target): any {
    const insideClick: any = this.filterContent?.nativeElement.contains(event.target);
    const buttonCLick: any = this.filterBtnRef?.nativeElement.contains(event.target);
    if (!buttonCLick && !insideClick && !this.insideEvent && !this.closeEvent && !this.clearbutton) {
      this.popover?.hide();
    }
  }
  filterPosition() {
    this.language.subscribe(language => {
      this.lang = language;
      this.width = window.innerWidth;
      if (this.isDynamicPositionRequired) {
        if (this.filterId) {
          this.filterPositionWidth = document?.getElementById(this.filterId)?.getBoundingClientRect().left;
        } else {
          this.filterPositionWidth = document.getElementsByClassName('btn-filter')[0]?.getBoundingClientRect().left;
        }
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
    this.filterPosition();
    if (this.adaptivePosition) this.placement = 'right top';
  }
  ngAfterViewInit() {
    this.language.subscribe(language => {
      this.lang = language;
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
    this.filterPosition();
    if (!this.adaptivePosition && !this.isOpen && !this.noScroll)
      scrollToPosition(0, getScreenCoordinates(this.filterBtnRef.nativeElement).yPos - 50);
  }

  /**
   * Method to handle hide event of the popover
   */
  onHidden(): void {
    if (this.outsideClick) {
      this.filterPosition();
    }
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

