/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

const bounceTime = 500;
/**
 * Component that handles the button details.
 *
 * @export
 * @class ButtonDcComponent
 *
 */
@Component({
  selector: 'gosi-button-dc',
  templateUrl: './button-dc.component.html',
  styleUrls: ['./button-dc.component.scss']
})
export class ButtonDcComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() disabled = false;
  @Input() show = true;
  @Input() loading = false;
  @Input() type = 'primary';
  @Input() id = '';
  @Input() size = 'lg';
  @Input() outlineOnly = false;
  @Input() isTransparent = false;
  @Input() isFullWidth = false;
  @Input() isFullWidthImp = false;
  @Input() mobFullWidth = true;

  @Output() submit: EventEmitter<Object> = new EventEmitter();
  readonly click = new Subject();
  private subscription: Subscription;

  /**
   * Creates an instance of ButtonDcComponent.
   * @memberof ButtonDcComponent
   */
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof ButtonDcComponent
   */
  ngOnInit() {
    this.subscription = this.click.pipe(debounceTime(bounceTime), throttleTime(bounceTime * 4)).subscribe(e => {
      this.submit.emit(e);
    });
  }

  /**
   * This method is to handle the button submit event.
   *
   * @param {any} event
   * @memberof ButtonDcComponent
   */
  btnSubmit(event) {
    this.click.next(event);
  }

  /**
   * This method is to perform any cleanup activities on component destruction.
   *
   * @memberof ButtonDcComponent
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
