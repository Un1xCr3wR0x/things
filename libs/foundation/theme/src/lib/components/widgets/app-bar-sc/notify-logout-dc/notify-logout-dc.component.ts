import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopupIcon } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Component to notify the user about the session expiration
 */
@Component({
  selector: 'gosi-ui-notify-logout-dc',
  templateUrl: './notify-logout-dc.component.html',
  styleUrls: ['./notify-logout-dc.component.scss']
})
export class NotifyLogoutDcComponent implements OnInit {
  closeSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  icon: string = PopupIcon.WARNING;
  private _timeBeforeLogout;

  @Input() infoMessage = 'THEME.SESSION-EXPIRATION';
  @Input() set timeBeforeLogout(timeout: number) {
    this._timeBeforeLogout = timeout;
  }
  get timeBeforeLogout() {
    return this._timeBeforeLogout;
  }

  @Output() close: EventEmitter<void>;

  constructor() {}

  ngOnInit(): void {}

  closeInfo() {
    this.closeSubject.next(true);
  }
}
