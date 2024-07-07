import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'est-tags-dc',
  templateUrl: './tags-dc.component.html',
  styleUrls: ['./tags-dc.component.scss']
})
export class TagsDcComponent implements OnInit {
  @Input() tags: Array<BilingualText | string>;
  @Input() label: string;
  @Input() selectedItems: Array<string | BilingualText> = [];
  @Output() selectTag = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  selectTags(tag) {
    if (tag) {
      if (tag?.english) {
        const index = this.selectedItems?.map(item => (item as BilingualText).english).indexOf(tag.english);
        if (index !== -1) {
          this.selectedItems?.splice(index, 1);
        } else {
          this.selectedItems?.push(tag);
        }
      } else {
        const index = this.selectedItems?.indexOf(tag);
        if (index !== -1) {
          this.selectedItems?.splice(index, 1);
        } else {
          this.selectedItems?.push(tag);
        }
      }
      this.selectTag.emit(this.selectedItems);
    }
  }

  checkIfActive(tag): boolean {
    let index = -1;
    if (tag?.english) {
      index = this.selectedItems?.map(item => (item as BilingualText)?.english)?.indexOf(tag?.english);
    } else {
      index = this.selectedItems?.indexOf(tag);
    }
    return index !== -1;
  }
}
