import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilessonComponent } from './multilesson.component';

describe('MultilessonComponent', () => {
  let component: MultilessonComponent;
  let fixture: ComponentFixture<MultilessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultilessonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultilessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
