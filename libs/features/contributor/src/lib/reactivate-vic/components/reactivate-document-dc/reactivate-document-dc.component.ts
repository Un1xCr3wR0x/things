import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TransactionId } from '../../../shared';
import { MaxLengthEnum } from '@gosi-ui/features/medical-board';

@Component({
  selector: 'cnt-reactivate-document-dc',
  templateUrl: './reactivate-document-dc.component.html',
  styleUrls: ['./reactivate-document-dc.component.scss']
})
export class ReactivateDocumentDcComponent implements OnInit {
  @Input() isCommentRequired: boolean;
  @Input() engagementId: number; 
  @Input() parentForm: FormGroup;
  @Input() documentList: DocumentItem[] = [];
  @Input() referenceNo: number;
  @Input() isSubmit: boolean;
  @Input() isApiTriggered: boolean;
  @Input() uuid;
  @Input() isEditMode: boolean;
 
  modalRef: BsModalRef;
  documentUploadForm:FormGroup;
  contTransactionId = TransactionId.REACTIVATE_VIC_ENGAGEMENT;
  commentMaxLength = MaxLengthEnum.COMMENTS;
  comments: string;


  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<Object> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();



  constructor(private modalService:BsModalService,
    readonly fb: FormBuilder) {   }

  ngOnInit(): void {
    console.log(this.documentList);
    if(!this.isEditMode)this.documentUploadForm = this.createCommentsForm();

    
  }

  createCommentsForm(): FormGroup {
    return this.fb.group({
      comments: ''    });
  }

  saveDocument(){
    this.comments = this.documentUploadForm.get('comments').value;
    this.submit.emit(this.comments);
    }
   
    navigateTopreviousTab(){
      this.previous.emit();
    }  

   /**
   * This method is used to show given template
   * @param template
   */
   showTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  confirmCancel(): void {
    this.reset.emit();
    this.decline();
  }
  
  /**Method to hide modal */
  decline(): void {
    this.modalRef.hide();
  }


   // Method to emit refresh details
   refreshDocument(document: DocumentItem) {
    this.refresh.emit(document);
  }

}
