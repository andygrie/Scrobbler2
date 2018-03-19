import { MdDialogRef } from '@angular/material';
import { Component, OnInit, Output } from '@angular/core';
import { UserService } from './user.service';
import { TrackService } from './track.service';
import { ArtistService } from './artist.service';
import { AlbumService } from './album.service';
import { EventEmitter } from 'protractor';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'new-scrobble-dialog',
    templateUrl: 'new-scrobble.dialog.component.html',
    styleUrls: [ 'new-scrobble.dialog.component.css']
})
export class ConfirmDialogNewScrobble implements OnInit{
    
    ngOnInit(): void {
        this.lastSelectedTrackMillis = 0;
    }

    public track: string;
    public album : string;
    public artist : string;
    public datetime : any;
    public wholeAlbum : any = false;
    public albumsForUpdate : any;
    public selectionType : any;
    public albumSelect : any;
    public tracksForUpdate : any;
    public selectionTypeTrack : any;
    public trackSelect : any;
    public datetimeAfter : any;
    public datetimeAfterText : any;

    public lastSelectedTrackMillis : any;


    constructor(public dialogRef: MdDialogRef<ConfirmDialogNewScrobble>, 
                private userService : UserService, 
                private trackService : TrackService,
                private artistService : ArtistService,
                private albumService : AlbumService) {
    }

    onSubmit(){

        let millis;
        
        if(this.datetime != undefined)
            millis  = (new Date(this.datetime)).getTime();
        else if(this.datetimeAfter != undefined)
            millis = (new Date(this.datetimeAfter)).getTime();

        let seconds = Math.round(millis / 1000);

        let correctAlbum;
        if(this.selectionType == 'write')
            correctAlbum = this.album;
        else
            correctAlbum = this.albumSelect.title;

        if(this.wholeAlbum)
            this.onSubmitWholeAlbum(0, seconds, correctAlbum);
        else{
            let correctTrack;
            if(this.selectionTypeTrack == 'write')
                correctTrack = this.track;
            else
                correctTrack = this.trackSelect.title;    

            this.trackService.scrobbleTrack(this.artist, correctTrack, correctAlbum, seconds).then(data => {
                console.log(data);
                this.dialogRef.close({
                                    startDate : data.scrobbles.scrobble.timestamp,
                                    endDate : data.scrobbles.scrobble.timestamp
                                });
            }, this.showErrorMessage);
        }
    }

    onSubmitWholeAlbum(index, currentDateTime, album){
        if(index != this.tracksForUpdate.length){
            this.trackService.scrobbleTrack(this.artist, this.tracksForUpdate[index].title, album, currentDateTime).then(data => {
                console.log(data);
                this.onSubmitWholeAlbum(index + 1, currentDateTime + Math.round(parseInt(this.tracksForUpdate[index].length) / 1000), album);
            }, this.showErrorMessage);
        }
        else{
            let millis;
            if(this.datetime != undefined)
                millis  = (new Date(this.datetime)).getTime();
            else if(this.datetimeAfter != undefined)
                millis = (new Date(this.datetimeAfter)).getTime();

            this.dialogRef.close({
                startDate : Math.round(millis / 1000),
                endDate : currentDateTime
            });
        }
    }

    loadReleaseGroups(offset : number) : void{
        this.artistService.getAlbumInfoFromMusicBrainzByArtistName(this.artist, offset).then(releases => {
            if(offset == 0)
                this.albumsForUpdate = releases['release-groups'];
            else
                this.albumsForUpdate = this.albumsForUpdate.concat(releases['release-groups']);
            if(offset + 100 < releases.count)
                this.loadReleaseGroups(offset + 100);
            else{
                this.albumsForUpdate.sort((a,b) =>{
                    let result = 0;
                    if(a.valid && !b.valid)
                        result = -1;
                    else if(!a.valid && b.valid)
                        result = 1;
                    else if(a.title < b.title)
                        result = -1;
                    else if(a.title > b.title)
                        result = 1;
                    return result;
                });
             }
             console.log(this.albumsForUpdate);
        });
    }
    onSelectedAlbumChange() : void{
        this.albumService.getRecordingsFromMusicBrainzByRelease(this.albumSelect.id).then(recordings =>{
            let release = this.albumService.getOptimalReleaseFromArray(recordings.releases);
            console.log(release);
            this.tracksForUpdate = [];
            for(let i = 0; i < release.media.length; i++){
                for(let j = 0; j < release.media[i].tracks.length; j++){
                    this.tracksForUpdate.push(release.media[i].tracks[j]);
                }
            }
        });
    }
    onSelectTrackChange() : void{
        if(this.datetimeAfter != undefined){
            this.datetimeAfter = this.datetimeAfter - this.lastSelectedTrackMillis + this.trackSelect.length;
            this.datetimeAfterText = new Date(this.datetimeAfter).toLocaleDateString() + ' ' + new Date(this.datetimeAfter).toLocaleTimeString();
            this.lastSelectedTrackMillis = this.trackSelect.length;
        }
    }

    showErrorMessage(error : any) : void{
        alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
    }
}