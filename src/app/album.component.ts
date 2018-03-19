import { Component, OnInit, OnChanges, trigger, state, animate, transition, style } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserService } from './user.service';
import { AlbumService } from './album.service';
import { TrackService } from './track.service';
import { ArtistService } from './artist.service';

declare let d3: any;

@Component({
  selector: 'album',
  animations: [
    trigger('isVisibleChanged', [
      state("hidden", style({opacity: 0.9})),
      state("shown", style({opacity: 0})),
      transition("shown <=> hidden", animate( "300ms" ))
    ])
  ],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
    artistName : string;
    albumName : string;
    albumInfo : any;
    artistTracks : any[];
    optionsAlbum : any;
    imageStatus : string = 'hidden';
    options : any;
    data : any;
    correctRelease : any;
    allReleaseGroups : any = [];
    ngOnInit(): void {
        this.route.params.subscribe((params : Params) => {
            this.artistName = params['artist'];
            this.albumName = params['name'];
            this.getArtistTracks(1);
            this.getAlbumInfo();
            this.loadReleaseGroups(0);
            
        });
    }
    loadReleaseGroups(offset : number) : void{
        this.artistService.getAlbumInfoFromMusicBrainzByArtistName(this.artistName, offset).then(releases => {
            this.allReleaseGroups = this.allReleaseGroups.concat(releases['release-groups']);
            if(offset + 100 < releases.count)
                this.loadReleaseGroups(offset + 100);
            else{
                console.log(this.allReleaseGroups);
                let correctReleaseGroup = this.allReleaseGroups.find(rg => rg.title === this.albumName);
                console.log(correctReleaseGroup);
                if(correctReleaseGroup != undefined){
                    this.albumService.getRecordingsFromMusicBrainzByRelease(correctReleaseGroup.id).then(recordings =>{
                        console.log(correctReleaseGroup.id);
                        this.correctRelease = this.albumService.getOptimalReleaseFromArray(recordings.releases);
                        
                        console.log(recordings);
                        console.log(this.correctRelease);
                    });
                }
            }
        });
    }
    constructor(private route : ActivatedRoute, 
                private router : Router,
                private userService : UserService,
                private albumService : AlbumService,
                private trackService : TrackService,
                private localStorageService : LocalStorageService,
                private artistService : ArtistService){}

    getAlbumInfo() : void{
        this.albumService.getInfo(this.albumName, this.artistName, this.localStorageService.get('name').toString()).then(data => {
            this.albumInfo = data.album;
            for(let track of this.albumInfo.tracks.track){
                this.trackService.getInfo(this.artistName, track.name, this.localStorageService.get('name').toString()).then(data => {
                    if(data !== undefined){
                        track.playcount = data.playcount;
                        track.userplaycount = data['userplaycount'];
                    }
                    else{
                        track.playcount = 0
                        track.userplaycount = 0
                    }
                    if(this.albumInfo.tracks.track.find(searchTrack => searchTrack.playcount === undefined) === undefined)
                    console.log(data);
                }, this.showErrorMessage);
            }
        }, this.showErrorMessage);
    }
    getArtistTracks(page : number) : void{
        this.userService.getArtistTracks(page, this.artistName, -1, -1, this.localStorageService.get('name').toString()).then(data => {
            if(this.artistTracks == undefined)
                this.artistTracks = new Array<any>();
          this.artistTracks = this.artistTracks.concat(data);
          if(data.length == 200)
            this.getArtistTracks(page + 1);
          else{
              if(this.artistTracks.length != 0){
                // this.fillAlbumChartData();
              }
          }
        }, this.showErrorMessage);
    }
    getStringDuration(duration : string) : string{
        let minutes =  Math.floor(parseInt(duration) / 60);
        let seconds = (parseInt(duration) - Math.floor(parseInt(duration) / 60) * 60);
        let secondsString : string;
        if(seconds < 10)
            secondsString = '0' + seconds;
        else
            secondsString = seconds.toString();
        return minutes + ':' + secondsString;
    }
    imageHovered() : void {
        this.imageStatus = 'shown';
    }
    imageLeft() : void {
        this.imageStatus = 'hidden';
    }
    showErrorMessage(error : any) : void{
        console.log(error);
        alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
    }
}