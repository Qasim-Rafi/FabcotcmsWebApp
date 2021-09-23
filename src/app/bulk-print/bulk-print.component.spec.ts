import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPrintComponent } from './bulk-print.component';

describe('BulkPrintComponent', () => {
  let component: BulkPrintComponent;
  let fixture: ComponentFixture<BulkPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
