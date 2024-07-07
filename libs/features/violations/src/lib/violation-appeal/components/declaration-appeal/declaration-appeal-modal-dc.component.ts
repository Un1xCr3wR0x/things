import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {BilingualText} from "@gosi-ui/core";

@Component({
  selector: 'vol-declaration-appeal-modal-dc',
  templateUrl: './declaration-appeal-modal-dc.component.html',
  styleUrls: ['./declaration-appeal-modal-dc.component.scss']
})
export class DeclarationAppealModalDcComponent implements OnInit {
    private _iconName: string;

  @Input()
  set iconName(value: string) {
    this._iconName = `assets/icons/svg/${value}_popup.svg`;
  }

  get iconName(): string {
    return this._iconName;
  }

  @Input() customFooter: TemplateRef<HTMLElement>;


  @Output() onConfirm: EventEmitter<boolean> = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  isAccept: boolean = false;
  showDeclare: boolean = false;
  @Input() violationType: string;
  @Input() listOfRequired: BilingualText[];
  @Input() declareText: BilingualText;

  constructor() {
  }

  ngOnInit() {
  }

  confirm() {
    if (this.isAccept) {
      this.onConfirm.emit(this.isAccept);
    }
    this.showDeclare = true;

  }

  decline() {
    this.onCancel.emit();
  }

  onChangeDeclaration() {
    this.isAccept = !this.isAccept;
    this.showDeclare = false;
  }
}
