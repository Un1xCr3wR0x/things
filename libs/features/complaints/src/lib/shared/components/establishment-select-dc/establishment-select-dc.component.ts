import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ces-establishment-select-dc',
  templateUrl: './establishment-select-dc.component.html',
  styleUrls: ['./establishment-select-dc.component.scss']
})
export class EstablishmentSelectDcComponent implements OnInit {
  @Input() items: any[] = [];
  @Output() selectionChanged = new EventEmitter<any[]>();
  @Output() delete = new EventEmitter<any>();

  @Input() initialSelected: any[] = [];
  @Input() isSelectionNeeded: any = true;

  selectedItems: any[] = [];
  isSelection: any;
  width: number;
  constructor() {}
  @HostListener('window:resize', ['$event'])
  onWIndowREsize() {
    this.width = window.innerWidth;
  }

  ngOnInit(): void {
    this.onWIndowREsize();
    if (this.width == undefined) {
      this.width = 1000;
    }
  }
  toggleSelection(tile) {
    if (!this.isSelection) {
      return;
    }
    if (this.isSelected(tile)) {
      this.selectedItems = this.selectedItems.filter(i => i !== tile);
    } else {
      this.selectedItems.push(tile);
    }
    this.selectionChanged.emit(this.selectedItems);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialSelected && changes.initialSelected.currentValue) {
      this.selectedItems = [...this.initialSelected];
    }
    if (changes.isSelectionNeeded && changes.isSelectionNeeded.currentValue) {
      this.isSelection = changes.isSelectionNeeded.currentValue;
    }
  }
  isSelected(tile: any) {
    return this.selectedItems.indexOf(tile) >= 0;
  }
  onDelete(tile) {
    this.delete.emit(tile);
  }
}
