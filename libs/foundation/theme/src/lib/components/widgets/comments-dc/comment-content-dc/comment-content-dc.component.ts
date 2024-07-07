import { Component, OnInit, Input, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageToken, WorkFlowActions } from '@gosi-ui/core';

@Component({
  selector: 'gosi-comment-content-dc',
  templateUrl: './comment-content-dc.component.html',
  styleUrls: ['./comment-content-dc.component.scss']
})
export class CommentContentDcComponent implements OnInit {
  @Input() comment;
  @Input() limit? = 100;
  @Input() BilligLimit? = 3;
  @Input() transactionType;
  @Input() showComments = false;
  @Input() reimbPendingReason;
  @Input() reimbRejectionReason;

  rejectTag = WorkFlowActions.REJECT;
  returnTag = WorkFlowActions.RETURN;
  lang = 'en';
  showMoreText = 'THEME.SHOW-MORE';
  showFlag = false;
  limitvalue: number;
  currentBillingLimit: number;
  validatorName: string;
  ValidatorComment: boolean;
  reasonComment: string;
  reason: string;
  reasonTag: string = null;
  bilinArr: string[] = [];
  showAction: boolean;
  showActionComments: boolean;
  isAngleDown = true;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
      this.resonSetter();
      // this.validatorNameInComment();
    });
    this.limitvalue = this.limit;
    this.currentBillingLimit = this.BilligLimit;
  }
  showMore(commentText) {
    this.showFlag = !this.showFlag;
    if (this.showFlag) {
      this.limit = commentText.length;
      this.showMoreText = 'THEME.SHOW-LESS';
      this.isAngleDown = !this.isAngleDown;
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'THEME.SHOW-MORE';
      this.isAngleDown = !this.isAngleDown;
    }
  }
  resonSetter() {
    if (this.reimbPendingReason) {
      this.showAction = true;
      this.showActionComments = true;
      const { english, arabic } = this.reimbPendingReason;
      this.reasonComment = this.lang === 'en' ? english : arabic;
    } else if (this.reimbRejectionReason) {
      this.showAction = true;
      this.showActionComments = true;
      const { english, arabic } = this.reimbRejectionReason;
      this.reasonComment = this.lang === 'en' ? english : arabic;
    }
    if (this.comment.transactionStepStatus === 'Return') {
      this.showAction = true;
      this.showActionComments = true;
      this.reasonTag = 'THEME.RETURN';
      if (this.comment.rejectionReason === null) {
        this.reasonComment = '';
      } else {
        const { english, arabic } = this.comment.rejectionReason;
        this.reasonComment = this.lang === 'en' ? english : arabic;
      }
    } else if (this.comment.transactionStepStatus === 'Submit Clarification') {
      this.showAction = true;
      this.reasonComment = this.comment.comments;
      this.reasonTag = 'THEME.CLARIFICATION-SUBMITTED';
    } else if (this.comment.transactionStepStatus === 'Submit' && this.comment.rejectionReason !== null) {
      this.showAction = false;
    } else if (this.comment.rejectionReason) {
      const { english, arabic } = this.comment.rejectionReason;
      this.showAction = true;
      this.showActionComments = true;
      this.reasonComment = this.lang === 'en' ? english : arabic;
      if (this.transactionType) {
        this.reasonTag = 'THEME.INITIATE-REJECTED';
      } else {
        this.reasonTag = 'THEME.REJECTED';
      }
    } else if (this.comment.returnReason) {
      const { english, arabic } = this.comment.returnReason;
      this.showAction = true;
      this.showActionComments = true;
      this.reasonComment = this.lang === 'en' ? english : arabic;
      this.reasonTag = 'THEME.RETURN';
    }
  }
  showMoreBilligList() {
    this.currentBillingLimit =
      this.currentBillingLimit === this.comment.bilingualComments.length
        ? this.BilligLimit
        : this.comment.bilingualComments.length;
    this.showMoreText = this.showMoreText === 'THEME.SHOW-MORE' ? 'THEME.SHOW-LESS' : 'THEME.SHOW-MORE';
  }

  // validatorNameInComment(){
  //   if(this.comment.role.english == 'user'){
  //   this.validatorName = this.lang === 'en' ? 'Insurance Validator' : 'مدقق تأميني';
  //   this.ValidatorComment = true;
  //   }
  // }
}
