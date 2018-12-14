import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScrobble.DialogComponent } from './new-scrobble.dialog.component';

describe('NewScrobble.DialogComponent', () => {
  let component: NewScrobble.DialogComponent;
  let fixture: ComponentFixture<NewScrobble.DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewScrobble.DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScrobble.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
