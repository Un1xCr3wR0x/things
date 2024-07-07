import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs-compat';
import { AppealValidatorRoles } from '..';
import { WorkFlowActions } from '@gosi-ui/core';

@Injectable({
  providedIn: 'root'
})
export class FirstLevelFormService {
  private formValueSubject = new Subject<any>();
  private formNotifierToUpdateSubject = new Subject<any>();

  constructor() {}

  updateFormValue(formData: any, outCome?: WorkFlowActions) {
    this.formValueSubject.next({ formData, outCome });
  }

  getFormValue(): Observable<{ formData: any; outCome?: WorkFlowActions }> {
    return this.formValueSubject.asObservable();
  }

  notifyFormToEmit(data: { type: AppealValidatorRoles; outCome?: WorkFlowActions }): void {
    this.formNotifierToUpdateSubject.next(data);
  }

  listenOnFormToEmitting(): Observable<{ type: AppealValidatorRoles; outCome?: WorkFlowActions }> {
    return this.formNotifierToUpdateSubject.asObservable();
  }
}
