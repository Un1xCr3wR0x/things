import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private isUnclaimedSubject = new BehaviorSubject<boolean>(false);
  isUnclaimed$ = this.isUnclaimedSubject.asObservable();

  setIsUnclaimed(value: boolean) {
    this.isUnclaimedSubject.next(value);
  }
}
