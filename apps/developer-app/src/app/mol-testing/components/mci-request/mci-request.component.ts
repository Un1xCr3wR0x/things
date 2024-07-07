import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'dev-mci-request',
  templateUrl: './mci-request.component.html',
  styleUrls: ['./mci-request.component.scss']
})
export class MciRequestComponent implements OnInit {
  @Input() body: FormControl = new FormControl();
  constructor(private requetServce: RequestService) {}

  ngOnInit(): void {
    this.body.valueChanges
      .pipe(
        tap(res => {
          this.requetServce.body$.next(res);
        })
      )
      .subscribe();
  }
}
