import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'est-draft-popup-dc',
  templateUrl: './draft-popup-dc.component.html',
  styleUrls: ['./draft-popup-dc.component.scss']
})
export class DraftPopupDcComponent implements OnInit {

  isSmallScreen: boolean;

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
