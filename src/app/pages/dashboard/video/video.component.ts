import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IvmsplayerComponent } from 'src/app/utilities/ivmsplayer/ivmsplayer.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  @ViewChildren(IvmsplayerComponent) playersList: QueryList<IvmsplayerComponent>

  constructor() { }

  ngOnInit(): void {
  } 
  currentValue = '';
  showPlayers = false;
  playerConfig=[
    {
      url:'https://s3.amazonaws.com/x265.org/video/Tractor_500kbps_x265.mp4',
      videoID: 'canvas1',
      isPlayback: true,
      autoPlay: true,
      autoRestart: false
    },
    {
      url:'rtsp://admin:12345q@z@ngabatanlap.cameraddns.net:1024/Streaming/Channels/01',
      videoID: 'canvas2',
      isPlayback: false,
      autoPlay: false,
      autoRestart: false
    }
  ]
      /*
      rtsp://admin:12345q@z@ngabatanlap.cameraddns.net:1024/Streaming/Channels/01,https://s3.amazonaws.com/x265.org/video/Tractor_500kbps_x265.mp4
      */
  setupPlayers()
  {
    this.showPlayers = false;
    let dataArray = this.currentValue.split(',');
    console.log(dataArray)
    this.playerConfig = [];
    for (var i=0; i<dataArray.length; i++){
      let config = {
        url:'',
        videoID: 'canvas' + i,
        isPlayback: false,
        autoPlay:false,
        autoRestart:true
      }
      config.url = dataArray[i]
      this.playerConfig.push(config)
    }
    console.log(this.playerConfig)
    let self=this;
    setTimeout(() => {
      self.showPlayers = true;
    }, 3000);   
    setTimeout(() => {
      // self.checkReferences();
    }, 5000);  
  } 

  checkReferences()
  {
    console.log(this.playersList)
    this.playersList.forEach(player => {
      player.togglePlay();
    });

  }
}
