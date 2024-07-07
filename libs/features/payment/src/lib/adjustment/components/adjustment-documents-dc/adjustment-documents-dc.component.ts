import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';

@Component({
  selector: 'pmt-adjustment-documents-dc',
  templateUrl: './adjustment-documents-dc.component.html',
  styleUrls: ['./adjustment-documents-dc.component.scss']
})
export class AdjustmentDocumentsDcComponent implements OnInit {
  @Input() document: DocumentItem[];
  @Input() transactionDocs: DocumentItem[];
  @Input() isGosiAdjustment = false;

  @Output() addDocs: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  addDocumentButton() {
    this.addDocs.emit();
  }
}
