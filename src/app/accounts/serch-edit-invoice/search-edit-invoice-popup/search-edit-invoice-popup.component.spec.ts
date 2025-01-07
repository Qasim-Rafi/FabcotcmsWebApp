import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEditInvoicePopupComponent } from './search-edit-invoice-popup.component';

describe('SearchEditInvoicePopupComponent', () => {
  let component: SearchEditInvoicePopupComponent;
  let fixture: ComponentFixture<SearchEditInvoicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchEditInvoicePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEditInvoicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
