import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabcotTrendsComponent } from './fabcot-trends.component';

describe('FabcotTrendsComponent', () => {
  let component: FabcotTrendsComponent;
  let fixture: ComponentFixture<FabcotTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabcotTrendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabcotTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
