import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalUsuariosComponent } from './personal-usuarios.component';

describe('PersonalUsuariosComponent', () => {
  let component: PersonalUsuariosComponent;
  let fixture: ComponentFixture<PersonalUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
