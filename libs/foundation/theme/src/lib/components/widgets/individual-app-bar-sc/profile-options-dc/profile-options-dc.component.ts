import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleIdEnum } from '@gosi-ui/core';

@Component({
  selector: 'gosi-profile-options-dc',
  templateUrl: './profile-options-dc.component.html',
  styleUrls: ['./profile-options-dc.component.scss']
})
export class IndividualProfileOptionsDcComponent implements OnInit {
  preferenceRoute = '/home/profile/user-activity/preference';
  passwordChangeRoute = '/home/profile/user-activity/change-password';

  @Input() isAppPublic = false;
  @Input() isAppIndividual = false;
  @Input() showLogoutOnly: boolean;
  @Input() allowedRoles: RoleIdEnum[] = [];
  @Output() logout: EventEmitter<void> = new EventEmitter();
  @Output() routeTo: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
