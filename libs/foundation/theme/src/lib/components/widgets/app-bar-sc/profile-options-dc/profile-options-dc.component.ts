import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, RoleIdEnum } from '@gosi-ui/core';

@Component({
  selector: 'gosi-profile-options-dc',
  templateUrl: './profile-options-dc.component.html',
  styleUrls: ['./profile-options-dc.component.scss']
})
export class ProfileOptionsDcComponent implements OnInit {
  preferenceRoute = '/home/profile/user-activity/preference';
  passwordChangeRoute = '/home/profile/user-activity/change-password';
  updateContactRoute = '/home/profile/user-activity/update-user-contact';

  @Input() isAppPublic = false;
  @Input() isAppIndividual = false;
  @Input() showLogoutOnly: boolean;
  @Input() allowedRoles: RoleIdEnum[] = [];
  @Output() logout: EventEmitter<void> = new EventEmitter();
  @Output() routeTo: EventEmitter<string> = new EventEmitter();
  isPrivate: boolean;
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }
}
