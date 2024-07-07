/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'est-heading-dc',
  templateUrl: './heading-dc.component.html',
  styleUrls: ['./heading-dc.component.scss']
})
export class HeadingDcComponent implements OnInit {
  isArabicScreen: boolean;
  bsModalRef: BsModalRef;

  @Input() backLink: string; //Route to navigate back
  @Input() shouldPrompt = false; //If the go back action should trigger the pop up
  @Input() canNavigate = true; //Should trigger navigate from this component
  @Input() isTransparent = false;
  @Input() showBackArrow = true;
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
   * @param template
   */
  showModal(template: TemplateRef<HTMLElement>) {
    if (this.shouldPrompt) {
      this.bsModalRef = this.bsModalService.show(template);
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
