import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { ArtistComponent } from './components/artist/artist.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { RecentTracksComponent } from './components/recent-tracks/recent-tracks.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { AlbumComponent } from './components/album/album.component';
import { FriendsComponent } from './components/friends/friends.component';
import { ReleasesComponent } from './components/releases/releases.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagComponent } from './components/tag/tag.component';

const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'recentTracks', component: RecentTracksComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'artist/:name', component: ArtistComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'album/:name/:artist', component: AlbumComponent },
  { path: 'tracks', component: TracksComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'releases', component: ReleasesComponent },
  { path: 'tags', component: TagsComponent },
  { path: 'tag/:name', component: TagComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
