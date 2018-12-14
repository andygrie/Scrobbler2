import { BrowserModule } from "@angular/platform-browser";
import { MaterialModule } from "./modules/material/material.module";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import "hammerjs";
import { ChartModule } from "angular2-highcharts";
import { HighchartsStatic } from "angular2-highcharts/dist/HighchartsService";
import { StorageServiceModule } from "angular-webstorage-service";
export function highchartsFactory() {
  return require("highcharts/highstock");
}
import { MyDateRangePickerModule } from "mydaterangepicker";

import { AuthenticationService } from "./authentication.service";
import { UserService } from "./user.service";
import { ArtistService } from "./artist.service";
import { TrackService } from "./track.service";
import { AlbumService } from "./album.service";
import { DialogService } from "./dialog.service";
import { TagService } from "./tag.service";
import { LocalStorageService } from "./services/localStorage/local-storage.service";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ArtistsComponent } from "./artists.component";
import { ArtistComponent } from "./artist.component";
import { AlbumsComponent } from "./albums.component";
import { RecentTracksComponent } from "./recent-tracks.component";
import { TracksComponent } from "./tracks.component";
import { AlbumComponent } from "./album.component";
import { TagsComponent } from "./tags.component";
import { TagComponent } from "./tag.component";
import { FriendsComponent } from "./friends.component";
import { ReleasesComponent } from "./releases.component";
import { ConfirmDialogAlbumsOfArtist } from "./albums-of-artist.dialog.component";
import { ConfirmDialogTrackInfo } from "./trackinfo.dialog.component";
import { ConfirmDialogNewScrobble } from "./new-scrobble.dialog.component";
import { SpinnerComponent } from "./spinner.component";

import { ArtistFilterPipe } from "./artist-filter.pipe";
import { OrderByDatePipe } from "./order-by-date.pipe";
declare var require: any;
@NgModule({
  declarations: [
    AppComponent,
    ArtistsComponent,
    ArtistComponent,
    AlbumsComponent,
    TracksComponent,
    TagsComponent,
    TagComponent,
    RecentTracksComponent,
    AlbumComponent,
    FriendsComponent,
    ReleasesComponent,
    ConfirmDialogAlbumsOfArtist,
    ConfirmDialogTrackInfo,
    ConfirmDialogNewScrobble,
    ArtistFilterPipe,
    OrderByDatePipe,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ChartModule,
    MyDateRangePickerModule,
    StorageServiceModule
  ],
  providers: [
    AuthenticationService,
    UserService,
    ArtistService,
    TrackService,
    AlbumService,
    TagService,
    LocalStorageService,
    DialogService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ],
  entryComponents: [
    ConfirmDialogAlbumsOfArtist,
    ConfirmDialogTrackInfo,
    ConfirmDialogNewScrobble
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
