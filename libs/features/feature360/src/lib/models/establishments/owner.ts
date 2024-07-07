import { GosiCalendar, Person } from '@gosi-ui/core';

export class Owner {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  person: Person = new Person();
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
