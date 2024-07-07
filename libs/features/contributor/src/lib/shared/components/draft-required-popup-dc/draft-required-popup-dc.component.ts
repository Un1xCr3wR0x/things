import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cnt-draft-required-popup-dc',
  templateUrl: './draft-required-popup-dc.component.html',
  styleUrls: ['./draft-required-popup-dc.component.scss']
})
export class DraftRequiredPopupDcComponent implements OnInit {
  isSmallScreen: boolean;
  @Input() transactionRefNo: number;

  @Output() keepDraftEvent = new EventEmitter();
  @Output() discardEvent = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.onWindowResize();
  }

  ngOnChanges() {
    this.onWindowResize();
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize(){
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  discard() {
    this.discardEvent.emit();
  }

  keepDraft() {
    this.keepDraftEvent.emit();
  }

  closeModal() {
    this.onCancel.emit();
  }
}
