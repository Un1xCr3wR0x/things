import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'est-draft-initiate-popup-dc',
  templateUrl: './draft-initiate-popup-dc.component.html',
  styleUrls: ['./draft-initiate-popup-dc.component.scss']
})
export class DraftInitiatePopupDcComponent implements OnInit {

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
