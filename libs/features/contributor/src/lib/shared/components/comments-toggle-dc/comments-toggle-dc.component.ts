import { Component, Output, EventEmitter, Input } from '@angular/core';
import { InputBaseComponent } from '@gosi-ui/core';
import { getErrorMsg } from '@gosi-ui/core';
import { FormControl } from '@angular/forms';
import { MaxLengthEnum } from '../../enums';

@Component({
  selector: 'cnt-comments-toggle-dc',
  templateUrl: './comments-toggle-dc.component.html',
  styleUrls: ['./comments-toggle-dc.component.scss']
})
export class CommentsToggleDcComponent extends InputBaseComponent {
  /**Input variables */
  @Input() activeLabel: string;
  @Input() inActiveLabel: string;
  @Input() isToggleTypeDanger = false;
  @Input() commentsControl: FormControl;

  /**Output event emmitter */
  @Output() changeEvent: EventEmitter<boolean> = new EventEmitter();

  /**Local variables */
  commentsMaxLength = MaxLengthEnum.COMMENTS;

  /**
   * This method is used to initialize CommentsToggleDcComponent
   */
  constructor() {
    super();
  }

  /**
   * Method to set value on change
   */
  changeItem(value) {
    if (value) {
      this.control.setValue(value.target.checked);
      this.changeEvent.emit(value.target.checked);
    }
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }
}
