import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavBarComponent } from './vertical-nav-bar.component';

describe('VerticalNavBarComponent', () => {
  let component: VerticalNavBarComponent;
  let fixture: ComponentFixture<VerticalNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalNavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
