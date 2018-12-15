import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmDialogNewScrobble } from "./new-scrobble.dialog.component";

describe("ConfirmDialogNewScrobble", () => {
  let component: ConfirmDialogNewScrobble;
  let fixture: ComponentFixture<ConfirmDialogNewScrobble>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogNewScrobble]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogNewScrobble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
