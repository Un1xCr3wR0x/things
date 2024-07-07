import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  LanguageToken,
  AppConstants
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { SessionStatusMembersScComponent } from './session-status-members-sc.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MedicalBoardListMock, ModalServiceStub } from 'testing';
import { PaginatePipe, PaginationService } from 'ngx-pagination';
import { BehaviorSubject } from 'rxjs';
import { MbRouteConstants } from '../../../shared/constants';
import { MedicalBoardList } from '../../../shared';

describe('SessionStatusMembersComponent', () => {
  let component: SessionStatusMembersScComponent;
  let fixture: ComponentFixture<SessionStatusMembersScComponent>;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [SessionStatusMembersScComponent, PaginatePipe],
      providers: [
        PaginationService,
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(SessionStatusMembersScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnChanges', () => {
    it('should ngOnChanges', () => {
      spyOn(component, 'ngOnChanges').and.callThrough();
      spyOn(component, 'getISDCodePrefix');
      expect(component.ngOnChanges).not.toHaveBeenCalled();
    });
  });
  it('should getISDCodePrefix', () => {
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === MedicalBoardListMock.isdCode) return AppConstants.ISD_PREFIX_MAPPING[key];
    });
    component.getISDCodePrefix(new MedicalBoardList());
  });
  it('should go to selected page no', () => {
    expect(component.pageDetails.currentPage).toBe(1);
    component.selectPage(2);
    expect(component.pageDetails.currentPage).toBe(2);
  });
  it('should showRemoveModal', () => {
    spyOn(component.modalService, 'show');
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showRemoveModal(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });
  it('should cancelRemoving', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.cancelRemoving();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should navigateToProfile', () => {
    component.navigateToProfile(12345);
    expect(component.router.navigate).toHaveBeenCalledWith([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(12345)]);
  });
  it('should call setIndex', () => {
    const data = 12;
    component.setIndex(data);
    expect(component.index).not.toEqual(null);
  });
  it('should removeMember', () => {
    spyOn(component, 'removeMedicalMember').and.callThrough();
    component.removeMember();
    expect(component.removeMedicalMember).toHaveBeenCalled();
  });
});
