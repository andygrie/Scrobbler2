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

import { AuthenticationService } from "./services/authentication/authentication.service";
import { UserService } from "./services/user/user.service";
import { ArtistService } from "./services/artist/artist.service";
import { TrackService } from "./services/track/track.service";
import { AlbumService } from "./services/album/album.service";
import { DialogService } from "./services/dialog/dialog.service";
import { TagService } from "./services/tag/tag.service";
import { LocalStorageService } from "./services/localStorage/local-storage.service";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ArtistsComponent } from "./components/artists/artists.component";
import { ArtistComponent } from "./components/artist/artist.component";
import { AlbumsComponent } from "./components/albums/albums.component";
import { RecentTracksComponent } from "./components/recent-tracks/recent-tracks.component";
import { TracksComponent } from "./components/tracks/tracks.component";
import { AlbumComponent } from "./components/album/album.component";
import { TagsComponent } from "./components/tags/tags.component";
import { TagComponent } from "./components/tag/tag.component";
import { FriendsComponent } from "./components/friends/friends.component";
import { ReleasesComponent } from "./components/releases/releases.component";
import { ConfirmDialogAlbumsOfArtist } from "./components/albums-of-artist.dialog/albums-of-artist.dialog.component";
import { ConfirmDialogTrackInfo } from "./components/trackinfo.dialog/trackinfo.dialog.component";
import { ConfirmDialogNewScrobble } from "./components/new-scrobble.dialog/new-scrobble.dialog.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";

import { ArtistFilterPipe } from "./pipes/artist-filter/artist-filter.pipe";
import { OrderByDatePipe } from "./pipes/order-by-date/order-by-date.pipe";
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
