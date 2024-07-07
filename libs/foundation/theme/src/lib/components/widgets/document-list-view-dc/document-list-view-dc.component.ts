import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';

@Component({
  selector: 'gosi-document-list-view-dc',
  templateUrl: './document-list-view-dc.component.html',
  styleUrls: ['./document-list-view-dc.component.scss']
})
export class DocumentListViewDcComponent implements OnInit, OnChanges {
  @Input() documents: DocumentItem[];
  @Input() icon? = true;
  @Input() isAccordionView = false;
  @Input() showSequenceNumber = false;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.documents && changes.documents.currentValue) {
      this.documents = changes.documents.currentValue;
    }
    if (changes && changes.icon && changes.icon.currentValue) {
      this.icon = changes.icon.currentValue;
    }
    if (changes && changes.isAccordionView && changes.isAccordionView.currentValue)
      this.isAccordionView = changes.isAccordionView.currentValue;
  }
}
