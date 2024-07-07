import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BilingualText, DropdownItem, EstablishmentStatusEnum } from '@gosi-ui/core';

@Component({
  selector: 'est-name-details-dc',
  templateUrl: './name-details-dc.component.html',
  styleUrls: ['./name-details-dc.component.scss']
})
export class NameDetailsDcComponent implements OnInit {
  cardStatus = 'success';

  @Input() showDropdown = true;
  @Input() name: BilingualText;
  @Input() isMain = false;
  @Input() status: BilingualText;
  @Input() registrationNo: number;
  @Input() dropdownList: DropdownItem[];

  @Output() selectedItem: EventEmitter<DropdownItem> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.setStatus();
  }

  setStatus() {
    this.cardStatus =
      this.status?.english === EstablishmentStatusEnum.REGISTERED
        ? 'success'
        : this.status?.english === EstablishmentStatusEnum.CLOSED
        ? 'disabled'
        : 'warning';
  }
}
