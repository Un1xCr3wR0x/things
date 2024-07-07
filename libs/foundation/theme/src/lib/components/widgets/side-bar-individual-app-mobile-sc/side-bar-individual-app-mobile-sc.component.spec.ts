import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TimeAgoPipe } from '@gosi-ui/foundation-theme/lib/pipes';
import {
  LanguageToken,
  SideMenuStateToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  RouterDataToken,
  RouterData,
  MenuToken,
  MenuService,
  MenuItem,
  StorageService,
  EnvironmentToken,
  AlertService,
  ContributorToken,
  ContributorTokenDto
} from '@gosi-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { IconsModule } from '@gosi-ui/foundation-theme/lib/icons.module';
import { SideBarScComponent } from './side-bar-sc.component';
import { menuData, StorageServiceStub, AlertServiceStub, BsModalServiceStub, MenuServiceStub } from 'testing';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
const routerSpy = { navigate: jasmine.createSpy('navigate'), events: of(new NavigationEnd(0, '/', '/')) };

describe('SideBarScComponent', () => {
  let component: SideBarScComponent;
  let fixture: ComponentFixture<SideBarScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarScComponent, TimeAgoPipe],
      imports: [FontAwesomeModule, IconsModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject('en')
        },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: BsModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PUBLIC },
        { provide: SideMenuStateToken, useValue: new BehaviorSubject<boolean>(true) },
        { provide: MenuToken, useValue: menuData.menuItems },
        { provide: MenuService, useClass: MenuServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: StorageService, useClass: StorageServiceStub },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ngOnInit', () => {
    component.ngOnInit();
    inject([LanguageToken], (language: BehaviorSubject<string>) => {
      language.subscribe(lang => {
        fixture.detectChanges();
        expect(lang).toBe('en');
      });
    });
    component.language.subscribe(lang => {
      expect(lang).toEqual('en');
    });
    spyOn(component, 'ngOnInit').and.callThrough();
    expect(component.selectedLang).toBeDefined();
    expect(component).toBeTruthy();
  });
  it('should ngOnChanges', () => {
    const menuItems: MenuItem[] = menuData.menuItems;
    const previousValue = menuItems;
    const currentValue = menuItems;
    const changesObj: SimpleChanges = {
      prop1: new SimpleChange(previousValue, currentValue, false)
    };
    component.ngOnChanges(changesObj);
    spyOn(component, 'ngOnChanges').and.callThrough();
    spyOn(component.menuService, 'getMenuItems').and.callThrough();
    expect(component.menuService.getMenuItems(menuItems)).toBeDefined();
    fixture.detectChanges();
  });
  it('should clear router data', () => {
    spyOn(component, 'clearRouterData').and.callThrough();
    component.clearRouterData('undefined');
    expect(component).toBeTruthy();
  });
  it('should open menu', () => {
    spyOn(component, 'openMenu').and.callThrough();
    spyOn(component.alertService, 'clearAlerts').and.callThrough();
    component.openMenu(0);
    expect(component).toBeTruthy();
  });
  it('should menuActive', () => {
    const item = new MenuItem();
    spyOn(component, 'menuActive').and.callThrough();
    component.menuActive(item);
    expect(component).toBeTruthy();
  });
});
