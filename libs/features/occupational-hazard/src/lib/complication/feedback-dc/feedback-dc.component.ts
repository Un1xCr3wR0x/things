import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Alert, AlertService, BilingualText, RouterConstants, FeedbackStatus } from '@gosi-ui/core';
import { ComplicationFeedback } from '../../shared/models';

@Component({
  selector: 'oh-feedback-dc',
  templateUrl: './feedback-dc.component.html',
  styleUrls: ['./feedback-dc.component.scss']
})
export class FeedbackAddComplicationDcComponent implements OnChanges {
  /**
   * Local variables
   */
  transactionMessage: BilingualText = null;
  feedbackStatus = FeedbackStatus;
  feedback: Alert;

  /**
   * Input variables
   */
  @Input() complicationId: number;
  @Input() feedbackdetails: ComplicationFeedback = new ComplicationFeedback();

  /**
   * Creates an instance of FeedbackAddComplicationDcComponent
   * @memberof  FeedbackAddComplicationDcComponent
   *
   */
  constructor(readonly router: Router, readonly alertService: AlertService) {}
  /**
   * Capturing the changes in input
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.feedbackdetails) {
      this.feedbackdetails = changes.feedbackdetails.currentValue;
      this.feedbackDetails();
    }
  }
  /**
   * Set the feedback messages
   */
  feedbackDetails() {
    this.feedback = new Alert();
    if (this.feedbackdetails.status.english != null) {
      if (
        this.feedbackdetails.status.english === FeedbackStatus.APPROVED ||
        this.feedbackdetails.status.english === FeedbackStatus.PENDING
      ) {
        this.feedback.message = this.feedbackdetails.transactionMessage;
      } else {
        this.feedback.message = this.feedbackdetails.transactionMessage;
      }
    }
  }
  /**
   * This method is to navigate to dashboard
   */
  navigate() {
    this.router.navigate([RouterConstants.ROUTE_DASHBOARD]);
  }
}
