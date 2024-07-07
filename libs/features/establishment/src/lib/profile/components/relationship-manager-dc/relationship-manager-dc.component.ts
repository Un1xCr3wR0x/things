import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Establishment,
  EstablishmentStatusEnum,
  GenderEnum,
  LanguageToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentConstants } from '../../../shared';
import { Manager } from '../../../shared/models/manager';
import { RelationshipManager } from '../../../shared/models/relationship-manager';

@Component({
  selector: 'est-relationship-manager-dc',
  templateUrl: './relationship-manager-dc.component.html',
  styleUrls: ['./relationship-manager-dc.component.scss']
})
export class RelationshipManagerDcComponent implements OnInit {
  rotatedeg = 360;
  femaleGender = GenderEnum.FEMALE;
  isPrivate: boolean;
  accessRoles = EstablishmentConstants.ESTABLISHMENT_RELATIONSHIP_SUPERVISOR_ROLES;
  registered = EstablishmentStatusEnum.REGISTERED;
  noTelephoneNo = 'null';
  lang: string;
  @Input() heading: string;
  @Input() relationshipManager: RelationshipManager;
  @Input() relationOfficerIamDetails: Manager;
  @Input() establishment: Establishment;
  @Input() actionIcon = 'pencil-alt';

  @Output() addScreenLink: EventEmitter<void> = new EventEmitter();
  @Output() modifyScreenLink: EventEmitter<void> = new EventEmitter();

  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.language.subscribe(lan => (this.lang = lan));
  }

  addManager() {
    this.addScreenLink.emit();
  }
  modifyManager() {
    this.modifyScreenLink.emit();
  }
}
