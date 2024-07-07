import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {
  private _windowSize: BehaviorSubject<number> = new BehaviorSubject(this.getWindowSize());
  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        tap(() => {
          this._windowSize.next(this.getWindowSize());
        })
      )
      .subscribe();
  }

  //Method to get the window size
  getWindowSize() {
    return window.innerWidth;
  }

  //Provide access to windowSize
  get windowSize$(): Observable<number> {
    return this._windowSize.asObservable();
  }

  get windowSizeInBreakpoints$(): Observable<string> {
    return this.windowSize$.pipe(
      map(size => {
        if (size < 768) {
          return 'sm';
        } else if (size < 992) {
          return 'md';
        } else if (size > 992) {
          return 'lg';
        }
      })
    );
  }
}
