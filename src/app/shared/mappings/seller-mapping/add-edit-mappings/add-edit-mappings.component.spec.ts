import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMappingsComponent } from './add-edit-mappings.component';

describe('AddEditMappingsComponent', () => {
  let component: AddEditMappingsComponent;
  let fixture: ComponentFixture<AddEditMappingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMappingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
