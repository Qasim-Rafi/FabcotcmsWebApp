import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBankAccountComponent } from './change-bank-account.component';

describe('ChangeBankAccountComponent', () => {
  let component: ChangeBankAccountComponent;
  let fixture: ComponentFixture<ChangeBankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBankAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
