import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTermComponent } from './price-term.component';

describe('PriceTermComponent', () => {
  let component: PriceTermComponent;
  let fixture: ComponentFixture<PriceTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceTermComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
