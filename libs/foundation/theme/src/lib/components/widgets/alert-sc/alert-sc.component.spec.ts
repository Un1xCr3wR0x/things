import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertScComponent } from './alert-sc.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LanguageToken, AlertService, Alert } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { AlertServiceStub } from 'testing';
import { IconsModule } from '@gosi-ui/foundation-theme/lib/icons.module';

describe('AlertScComponent', () => {
  let component: AlertScComponent;
  let fixture: ComponentFixture<AlertScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconsModule],
      declarations: [AlertScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close method', () => {
    spyOn(component.alertService, 'clearAlert').and.callThrough();
    component.closed(new Alert());
    expect(component.alertService.clearAlert).toHaveBeenCalled();
  });
});
