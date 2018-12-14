import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmDialogAlbumsOfArtist } from "./albums-of-artist.dialog.component";

describe("ConfirmDialogAlbumsOfArtist", () => {
  let component: ConfirmDialogAlbumsOfArtist;
  let fixture: ComponentFixture<ConfirmDialogAlbumsOfArtist>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogAlbumsOfArtist]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogAlbumsOfArtist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
