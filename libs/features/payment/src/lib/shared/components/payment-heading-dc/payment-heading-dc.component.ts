import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pmt-payment-heading-dc',
  templateUrl: './payment-heading-dc.component.html',
  styleUrls: ['./payment-heading-dc.component.scss']
})
export class PaymentHeadingDcComponent implements OnInit {
  isArabicScreen: boolean;
  bsModalRef: BsModalRef;

  @Input() backLink: string; //Route to navigate back
  @Input() shouldPrompt: boolean; //If the go back action should trigger the pop up
  @Input() isTransparent = false;
  @Input() showBackArrow = true;
  @Input() canNavigate = true; //Should trigger navigate from this component
  @Input() showSeparator = true;

  @Output() backEvent: EventEmitter<void> = new EventEmitter();

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly bsModalService: BsModalService
  ) {}

  ngOnInit() {
    this.language.subscribe(lang => {
      if (lang === 'ar') {
        this.isArabicScreen = true;
      } else {
        this.isArabicScreen = false;
      }
    });
  }

  /**
   * Method to show modal
   * @param modalTemplate
   */
  showModal(modalTemplate: TemplateRef<HTMLElement>) {
    if (this.shouldPrompt) {
      this.bsModalRef = this.bsModalService.show(modalTemplate);
    } else {
      this.backEvent.emit();
      if (this.canNavigate) {
        this.router.navigate([this.backLink]);
      }
    }
  }

  /**
   * Method to clear modal
   */
  decline() {
    this.bsModalRef?.hide();
  }

  /**
   * Method to navigate back
   */
  navigateBack() {
    this.alertService.clearAlerts();
    this.backEvent.emit();
    if (this.canNavigate) {
      this.router.navigate([this.backLink]);
    }
    this.decline();
  }
}
