import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'cim-person-identifier-dc',
  templateUrl: './person-identifier-dc.component.html',
  styleUrls: ['./person-identifier-dc.component.scss']
})
export class PersonIdentifierDcComponent implements OnInit {
  @Output() id: EventEmitter<null> = new EventEmitter();
  idNumber = new FormControl(null, {
    validators: Validators.required
  });
  constructor(readonly router: Router) {}
  ngOnInit() {}
  /**
   * This method is used to search establishment
   */
  searchIdentifier() {
    this.router.navigate([`/home/individual/profile/${this.idNumber.value}`]);
    this.id.emit(this.idNumber.value);
  }
}
