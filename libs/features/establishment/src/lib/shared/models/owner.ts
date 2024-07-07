import { GosiCalendar, Person } from '@gosi-ui/core';
import { ActionTypeEnum } from '../enums';
import { EstablishmentOwner } from '../../../../../../core/src/lib/models/establishment-owner';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class Owner {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  estOwner?: EstablishmentOwner = new EstablishmentOwner();
  person: Person = new Person();
  recordAction: string = ActionTypeEnum.ADD;
  ownerId: number = undefined;
  bindToNewInstance(instance) {
    Object.keys(instance).forEach(key => {
      if (key in this) {
        if (key === 'person') {
          this[key] = new Person().fromJsonToObject(instance[key]);
        } else {
          this[key] = instance[key];
        }
      }
    });
    return this;
  }
}
