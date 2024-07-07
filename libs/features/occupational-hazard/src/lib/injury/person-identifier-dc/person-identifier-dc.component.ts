import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'oh-person-identifier-dc',
  templateUrl: './person-identifier-dc.component.html',
  styleUrls: ['./person-identifier-dc.component.scss']
})
export class PersonIdentifierDcComponent implements OnInit {
  idNumber = new FormControl(null, {
    validators: Validators.required
  });
  /**
   * Constructor
   */
  constructor(readonly router: Router) {}
  ngOnInit() {}
  /**
   * This method is used to search establishment
   */
  searchValues() {
    this.router.navigate([`/home/oh/injury/history/${this.idNumber.value}`]);
  }
}
