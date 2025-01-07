import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchEditInvoiceComponent } from './serch-edit-invoice.component';

describe('SerchEditInvoiceComponent', () => {
  let component: SerchEditInvoiceComponent;
  let fixture: ComponentFixture<SerchEditInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerchEditInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerchEditInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
