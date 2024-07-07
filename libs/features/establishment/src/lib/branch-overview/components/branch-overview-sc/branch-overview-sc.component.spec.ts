/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LanguageToken } from '@gosi-ui/core';
import { BilingualTextPipe, IconsModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, of } from 'rxjs';
import { BilingualTextPipeMock, BranchOverviewServiceMock } from 'testing';
import { routerSpy } from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentBranchWrapper } from '../../models';
import { BranchOverviewService } from '../../services/branch-overview.service';
import { BranchOverviewScComponent } from './branch-overview-sc.component';

export class StubbedModalService {
  public show(): void {}
}

describe('BranchOverviewScComponent', () => {
  let component: BranchOverviewScComponent;
  let fixture: ComponentFixture<BranchOverviewScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfiniteScrollModule, IconsModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [BranchOverviewScComponent],
      providers: [
        { provide: BranchOverviewService, useClass: BranchOverviewServiceMock },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: BsModalService, useClass: StubbedModalService },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: Router,
          useValue: routerSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(BranchOverviewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for getEstablishmentBranches', () => {
    const registrationNo = 9100090;
    it('should get branch list', () => {
      spyOn(component['branchOverviewService'], 'establishmentBranches').and.returnValue(
        of(new EstablishmentBranchWrapper())
      );
      component.getEstablishmentBranches(registrationNo, 0);
      expect(component.isLoading).toEqual(false);
    });
  });

  describe('test suite for onSearch', () => {
    const searchTerm = {
      value: 'Futures'
    };
    it('should get branch list when user searches and clicks search icon', () => {
      spyOn(component['branchOverviewService'], 'establishmentBranches').and.returnValue(
        of(new EstablishmentBranchWrapper())
      );
      component.onSearch(searchTerm);
      expect(component.isNomatch).toEqual(false);
    });
  });

  describe('test suite for searchKeyUp', () => {
    it('should get branch list on user search', () => {
      const searchTerm = 'Futures';
      spyOn(component['branchOverviewService'], 'establishmentBranches').and.returnValue(
        of(new EstablishmentBranchWrapper())
      );
      component.searchKeyUp(searchTerm);
      expect(component.isNomatch).toEqual(false);
    });
    it('should get branch list if no user search', () => {
      const searchTerm = '';
      component.searchKeyUp(searchTerm);
      expect(component.isNomatch).toEqual(false);
    });
  });

  describe('test suite for onScroll', () => {
    it('should get branch list on user search', () => {
      spyOn(component, 'onScroll').and.callThrough();
      component.onScroll();
      expect(component.isLoading).toBe(false);
    });
  });
});
