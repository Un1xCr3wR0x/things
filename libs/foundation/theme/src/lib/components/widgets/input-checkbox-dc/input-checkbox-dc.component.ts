import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { getErrorMsg, InputBaseComponent, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-input-checkbox-dc',
  templateUrl: './input-checkbox-dc.component.html',
  styleUrls: ['./input-checkbox-dc.component.scss']
})
export class InputCheckboxDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  value: boolean = null;

  @Input() lessPadding = false; //To reduce padding
  @Input() noSpacing = false; //To remove left & right padding and margin
  @Input() valid = true;
  @Input() showToolTipOnDisabled = false;
  @Output() select: EventEmitter<null> = new EventEmitter();
  @Input() isTranslatedText = false;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  @HostListener('change', ['$event.target.value'])
  change(val) {
    this.select.emit(val);
    this.value = val;
  }
  isDisabled() {
    if (this.disabled) {
      return true;
    } else return null;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.control && changes.control.currentValue) this.control = changes.control.currentValue;
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
