import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsComponent }   from './artists.component';
import { ArtistComponent } from './artist.component';
import { AlbumsComponent } from './albums.component';
import { RecentTracksComponent } from './recent-tracks.component';
import { TracksComponent } from './tracks.component';
import { AlbumComponent } from './album.component';
import { FriendsComponent } from './friends.component';
import { ReleasesComponent } from './releases.component';
import { TagsComponent } from './tags.component';
import { TagComponent } from './tag.component';

const routes: Routes = [
  { path: 'recentTracks', component: RecentTracksComponent },
  { path: 'artists',  component: ArtistsComponent },
  { path: 'artist/:name', component: ArtistComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'album/:name/:artist', component: AlbumComponent },
  { path: 'tracks', component: TracksComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'releases', component: ReleasesComponent},
  { path: 'tags', component: TagsComponent},
  { path: 'tag/:name', component: TagComponent}
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
