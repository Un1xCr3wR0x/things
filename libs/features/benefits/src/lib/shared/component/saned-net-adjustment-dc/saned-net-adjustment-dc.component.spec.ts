import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanedNetAdjustmentDcComponent } from './saned-net-adjustment-dc.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderStub } from 'testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SanedNetAdjustmentDcComponent', () => {
  let component: SanedNetAdjustmentDcComponent;
  let fixture: ComponentFixture<SanedNetAdjustmentDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [SanedNetAdjustmentDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SanedNetAdjustmentDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
