import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { DocumentItem, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-document-view-dc',
  templateUrl: './document-view-dc.component.html',
  styleUrls: ['./document-view-dc.component.scss']
})
export class DocumentViewDcComponent implements OnInit {
  //Local Variables
  lang = 'en';

  //Input Variables
  @Input() collapseView = false;
  @Input() documents: DocumentItem[];
  @Input() canEdit = true;

  //Output Variables
  @Output() onCollapse: EventEmitter<boolean> = new EventEmitter();
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter();

  /**
   * Creates an instance of DocumentListAreaDcComponent
   * @memberof  DocumentListAreaDcComponent
   *
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.language.subscribe(res => (this.lang = res));
  }

  /**
   * This method handles the initialization tasks.
   * @memberof  DocumentsDcComponent
   */
  ngOnInit() {}

  /**
   * This method is used to get the document type from the file name
   * @param documentItem
   */
  getDocumentType(documentItem: DocumentItem) {
    if (documentItem && documentItem.fileName) {
      return documentItem.fileName.slice(documentItem.fileName.length - 3).toLowerCase();
    }
  }
}
