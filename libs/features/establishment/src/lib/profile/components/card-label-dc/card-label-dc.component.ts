import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { LanguageEnum, LanguageToken, RoleIdEnum } from '@gosi-ui/core';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services/dashboard-search.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'est-card-label-dc',
  templateUrl: './card-label-dc.component.html',
  styleUrls: ['./card-label-dc.component.scss']
})
export class CardLabelDcComponent implements OnInit {
  @Input() labelId = 'labelId';
  @Input() label = 'labelId';
  @Input() value: string;
  @Input() labelIcon: string;
  @Input() actionIcon = 'pencil-alt';
  @Input() showAction = true;
  @Input() onlyLabel = false;
  @Input() customLabelIcon = undefined;
  @Input() isLink = false;
  @Input() accessRoles: RoleIdEnum[] = [];
  @Input() accessIdentifier: number;
  @Input() isActiveLabel = true;
  @Input() showIconSection = false;
  @Input() isBetaVersion =false;

  @Output() labelAction: EventEmitter<void> = new EventEmitter();
  enLang = LanguageEnum.ENGLISH;
  lang = 'en';

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly dashboardSearchService: DashboardSearchService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }

  actOnLabel() {
    if (this.isLink) {
      this.labelAction.emit();
    }
  }
}
