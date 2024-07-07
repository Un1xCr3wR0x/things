import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  heading$ = new BehaviorSubject('');
  hasToggle$ = new BehaviorSubject(true);
  hasDisable$ = new BehaviorSubject(true);
  required$ = new BehaviorSubject(true);
  disabled$ = new BehaviorSubject(false);
  hasFullWidth = false;
  constructor() {}
}
