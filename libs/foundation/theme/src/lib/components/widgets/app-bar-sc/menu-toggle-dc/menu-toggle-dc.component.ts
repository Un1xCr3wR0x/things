import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, HostListener } from '@angular/core';

@Component({
  selector: 'gosi-menu-toggle-dc',
  templateUrl: './menu-toggle-dc.component.html',
  styleUrls: ['./menu-toggle-dc.component.scss']
})
export class MenuToggleDcComponent implements OnInit {
  @Input() isOpen = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter();

  isMobile = true;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges() {
    this.onWindowResize();
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (window.innerWidth <= 1023) {
      this.isOpen = false;
      this.isMobile = true;
    }
  }
}
