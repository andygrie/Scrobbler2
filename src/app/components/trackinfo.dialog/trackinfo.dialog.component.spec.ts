import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Trackinfo.DialogComponent } from './trackinfo.dialog.component';

describe('Trackinfo.DialogComponent', () => {
  let component: Trackinfo.DialogComponent;
  let fixture: ComponentFixture<Trackinfo.DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Trackinfo.DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Trackinfo.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
