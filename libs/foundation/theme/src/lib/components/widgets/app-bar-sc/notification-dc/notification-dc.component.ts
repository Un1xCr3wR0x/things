import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Notification, NotificationCount, LanguageEnum } from '@gosi-ui/core';

@Component({
  selector: 'gosi-notification-dc',
  templateUrl: './notification-dc.component.html',
  styleUrls: ['./notification-dc.component.scss']
})
export class NotificationDcComponent implements OnInit, OnChanges {
  @Input() notifications: Notification[] = [];
  @Input() language: string;
  @Input() notificationCount: NotificationCount;
  @Output() selectItem: EventEmitter<Notification> = new EventEmitter();
  @Output() viewAll: EventEmitter<null> = new EventEmitter();
  languageEnumValue = LanguageEnum;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.notifications?.currentValue) {
      this.notifications = changes.notifications.currentValue;
    }
    if (changes?.language?.currentValue) {
      this.language = changes.language.currentValue;
    }
    if (changes?.notificationCount?.currentValue) {
      this.notificationCount = changes.notificationCount.currentValue;
    }
  }
  navigateAll() {
    this.viewAll.emit();
  }
  getText(text: string) {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, url => {
      // Relative path used because of url change breaks navigation 548883, 548781
      const link = url.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#%?=~_|!:,.;]*)/gi, '');
      return `<a class="link" href="${link}">${url}</a>`;
    });
  }
  stopBubbling(event) {
    if (document.getElementsByClassName('link')[0]?.contains(event.target) === true) event.stopPropagation();
  }
}
