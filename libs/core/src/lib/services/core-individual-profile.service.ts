import { Injectable } from '@angular/core';
import { BilingualText } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CoreIndividualProfileService {
  message: BilingualText;
  value: boolean;
  fromPage: string;
  constructor() {}
  getSuccessMessage() {
    return this.message;
  }

  setSuccessMessage(message?: BilingualText, value?: boolean) {
    this.message = message;
    this.value = value;
  }
  getEditValue() {
    return this.value;
  }
  setFromNavigation(from) {
    this.fromPage = from;
  }
  getFromNavigation() {
    return this.fromPage;
  }
}
