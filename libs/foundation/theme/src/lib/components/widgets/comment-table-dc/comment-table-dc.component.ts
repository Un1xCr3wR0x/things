import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TransactionReferenceData, DocumentItem } from '@gosi-ui/core';
@Component({
  selector: 'gosi-comment-table-dc',
  templateUrl: './comment-table-dc.component.html',
  styleUrls: ['./comment-table-dc.component.scss']
})
export class CommentTableDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() comments: TransactionReferenceData[] = [];
  @Input() showRole = false;
  @Input() commentLimit? = 2;
  @Input() transactionType;
  @Input() reimbPendingReason;
  @Input() reimbRejectionReason;
  @Input() showComments = false;
  @Input() documents: DocumentItem[];

  //Local Variables
  isShownFull = false;
  isShowLink = false;
  currentCommentLimit: number;
  commentsTmp: TransactionReferenceData[] = [];
  allCommentsText = 'THEME.SHOWALLCOMMENTS';
  isAngleDown = true;

  /**
   * This method is to instance the CommentsDcComponent
   */
  constructor() {}

  ngOnInit() {
    this.currentCommentLimit = this.commentLimit;
  }

  /**
   * This method is used to detect changes  in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.comments?.currentValue) {
      this.isShowLink = changes.comments.currentValue && changes.comments.currentValue.length > 2 ? true : false;
      this.comments = changes.comments.currentValue;
      this.comments = this.comments
        ? this.comments.filter(
            item => item.comments || item.bilingualComments || item.rejectionReason || item.returnReason
          )
        : [];
    }
  }

  /**
   * This method is set Icon Name
   * @param transaction
   */
  setIconName(userName: string) {
    const name: string[] = userName.split(' ');
    let iconName = name[0].substring(0, 1);
    if (name[name.length - 1] && name.length > 1) {
      if (name[name.length - 1].substring(0, 1) !== ' ') {
        iconName += name[name.length - 1].substring(0, 1);
      }
    }
    return iconName;
  }

  /**Method to toggle all comments section */
  showAllComments() {
    this.currentCommentLimit =
      this.comments.length === this.currentCommentLimit ? this.commentLimit : this.comments.length;
    this.allCommentsText =
      this.allCommentsText === 'THEME.SHOWALLCOMMENTS' ? 'THEME.SHOWLESSCOMMENTS' : 'THEME.SHOWALLCOMMENTS';
    this.isAngleDown = !this.isAngleDown;
  }
}
