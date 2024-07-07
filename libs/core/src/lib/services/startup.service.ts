import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ApplicationTypeToken, LanguageToken } from '../tokens';
import { ApplicationTypeEnum, LanguageEnum } from '../enums';
import { AppConstants } from '../constants';
import { BehaviorSubject, Subject } from 'rxjs';
import { BilingualText } from '../models';
import { takeUntil } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class StartupService implements OnDestroy {
  lang: LanguageEnum;
  destroy$: Subject<boolean> = new Subject();
  constructor(
    readonly metaTagService: Meta,
    readonly title: Title,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly swUpdate: SwUpdate
  ) {
    language.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lang = <LanguageEnum>res;
      this.setTitle();
    });
    this.detectServiceWorkerUpdates();
  }
  /**
   * Method to set title
   */
  private setTitle() {
    switch (this.appToken) {
      case ApplicationTypeEnum.PRIVATE:
        this.title.setTitle(this.getTitle(AppConstants.PRIVATE_TITLE));
        break;

      case ApplicationTypeEnum.PUBLIC:
        this.title.setTitle(this.getTitle(AppConstants.PUBLIC_TITLE));
        break;
    }
  }
  private getTitle(title: BilingualText) {
    return this.lang === LanguageEnum.ENGLISH ? title.english : title.arabic;
  }

  private detectServiceWorkerUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.swUpdate.activateUpdate().then(() => {
          window.location.reload();
        });
      });
      this.swUpdate.checkForUpdate();
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
