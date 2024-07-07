import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';

@Component({
  selector: 'vol-documents-dc',
  templateUrl: './documents-dc.component.html',
  styleUrls: ['./documents-dc.component.scss']
})
export class DocumentsDcComponent implements OnInit, OnChanges {
  @Input() documents: DocumentItem[];

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.documents) this.documents = changes?.documents?.currentValue;
    if (this.documents?.length > 0) {
      this.documents.forEach(item => {
        // item.name = null;
     const extractedData=item?.fileName.match(/_(.*?)\./)[1];
     item.name.english=`${item.name.english}_${extractedData}`;
     item.name.arabic=`${item.name.arabic}_${extractedData}`;
      });
    }
  }
}
