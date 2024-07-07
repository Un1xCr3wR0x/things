import { LovList } from '../models';

export const removeDuplicateLovList = function (events: LovList) {
  for (var i = 0; i < events?.items.length; i++) {
    for (var j = i + 1; j < events?.items.length; j++) {
      if (events.items[i]?.value.english === events.items[j]?.value.english) {
        events.items.splice(j, 1);
      }
    }
  }
  return events;
};
