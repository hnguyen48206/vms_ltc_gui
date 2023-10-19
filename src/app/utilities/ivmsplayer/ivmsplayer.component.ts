/// <reference types="@types/dom-mediacapture-record" />

import { Component, ElementRef, Input, OnInit, NgZone } from '@angular/core';
import { setupCanvas } from '../../../assets/web-gl-render.js';
import { bind, getFps, rendererClear } from '../../../assets/wcjs-render.js';
import * as moment from 'moment';
import fixWebmDuration from "fix-webm-duration";

@Component({
  selector: 'app-ivmsplayer',
  templateUrl: './ivmsplayer.component.html',
  styleUrls: ['./ivmsplayer.component.css']
})
export class IvmsplayerComponent implements OnInit {

  @Input() config: { url: string; videoID: string; isPlayback: boolean; autoPlay: boolean; autoRestart: boolean };

  //LIBRAY SETUP
  private canvas
  private renderContext
  private webChimeraPlayer
  private renderer
  private rendererOption = {
    fallbackRenderer: true
  }
  private cronManager
  //ELEMENT SELECTORS
  private player
  private playBtn
  private resetBtn
  private recordBtn
  private snapshotBtn
  private fullscreenBtn
  private fullscreen = false;
  private progressSlider
  private progressFill
  private textCurrent
  private textTotal
  private speedBtns
  private videoStream
  private mediaRecorder
  private recordedChunk
  public statusTxt = ''
  //STATUS CONTROLLERS
  private initSetup = false
  private fps
  private fpsCounter = 0;
  private currentTime = 0;
  private cssStringVar = null
  private isRecording = false
  private frameRecevingTime = null
  private frameCheckTimeout = null
  private currentFrame = null
  private previousFrame = null
  private currentSnapshot = null
  private playerStopIntentionally = false
  private windowHasFocus = true
  constructor(private el: ElementRef, private zone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let self=this
    document.addEventListener("visibilitychange", function(this) {
      if (document.visibilityState === 'visible') {
          console.log('has focus');
          self.windowHasFocus = true
      } else {
          console.log('lost focus');
          self.windowHasFocus = false
      }
  });

    let style: string = `
    .${this.config.videoID}-speed-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      margin-right: 20px;
      text-align: center;
      color: whitesmoke;
    }
    .${this.config.videoID}-speed-list li {
      color: whitesmoke;
      padding: 5px;
      cursor: pointer;
    }
    .${this.config.videoID}-speed-list li:hover,
    .${this.config.videoID}-speed-list li.${this.config.videoID}-active {
      color: whitesmoke;
      font-weight: bold;
    }
    .${this.config.videoID}-time {
      position: absolute;
      right: 30px;
      bottom: 100%;
      padding-bottom: 14px;
      color: whitesmoke;
    }
    .${this.config.videoID}-progress {
      height: 8px;
      width: calc(100% - 40px);
      background: rgba(60, 60, 60, 0.6);
      margin: auto;
      border-radius: 6px;
      position: absolute;
      left: 20px;
      bottom: 100%;
      transition: height 0.1s ease-in-out;
      cursor: pointer;
    }
    .${this.config.videoID}-progress:hover {
      height: 10px;
    }
    .${this.config.videoID}-progress-filled {
      background-color: #a8dab5;
      width: 0%;
      height: 100%;
      border-radius: 6px;
      transition: all 0.1s; 
    }
    .${this.config.videoID}-player-container {
      padding: 0px;
      width: 50vw;
      min-width: 100px;
      margin: auto;
    }
    .${this.config.videoID}-player {
      width: 100%;
      height: 0;
      padding-bottom: 56.25%;
      box-shadow: 0px 10px 0px -3px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
      background: #000000;
    }
    .${this.config.videoID}-player-status-txt{
      position: absolute;
      top: 5px;
      left: 20px;
      color: whitesmoke;
      font-weight:bold;
    }
    .${this.config.videoID}-player:fullscreen {
      padding-bottom: 100vh;
    }
    .${this.config.videoID}-player:-webkit-full-screen {
      padding-bottom: 100vh;
    }
    .${this.config.videoID}-player:-moz-full-screen {
      padding-bottom: 100vh;
    }
    .${this.config.videoID}-player:-ms-fullscreen  {
      padding-bottom: 100vh;
    }
    
    .${this.config.videoID}-controls {
      padding: 0;
      position: absolute;
      bottom: -80px;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      background: linear-gradient(
        180deg,
        rgba(37, 37, 37, 0) 10%,
        rgba(37, 37, 37, 0.6) 80%
      );
      transition: all 0.2s ease-in 5s;
    }
    .${this.config.videoID}-player:hover .${this.config.videoID}-controls {
      bottom: 0;
      transition: all 0.2s ease-out;
    }
    
    .${this.config.videoID}-controls-main {
      width: calc(100% - 40px);
      margin: auto;
      height: 100%;
      display: flex;
      justify-content: space-between;
    }
    .${this.config.videoID}-controls-left,
    .${this.config.videoID}-controls-right {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .${this.config.videoID}-controls-left {
      margin-left: 10px;
    }
    .${this.config.videoID}-controls-right {
      margin-right: 10px;
      justify-content: flex-end;
    }
    .${this.config.videoID}-snapshot-btn
    {
      width: 30px;
      height: 30px;  
      cursor: pointer; 
      margin-left: 15px;  
    }
    .${this.config.videoID}-snapshot-btn-shake {
      animation: ${this.config.videoID}-snapshot-btn-shake-animation 1s infinite;
      -webkit-animation: ${this.config.videoID}-snapshot-btn-shake-animation 1s infinite;
    }
    @keyframes ${this.config.videoID}-snapshot-btn-shake-animation {
      0% { transform: translate(1px, 1px) rotate(0deg); }
      10% { transform: translate(-1px, -2px) rotate(-1deg); }
      20% { transform: translate(-3px, 0px) rotate(1deg); }
      30% { transform: translate(3px, 2px) rotate(0deg); }
      40% { transform: translate(1px, -1px) rotate(1deg); }
      50% { transform: translate(-1px, 2px) rotate(-1deg); }
      60% { transform: translate(-3px, 1px) rotate(0deg); }
      70% { transform: translate(3px, 1px) rotate(-1deg); }
      80% { transform: translate(-1px, -1px) rotate(1deg); }
      90% { transform: translate(1px, 2px) rotate(0deg); }
      100% { transform: translate(1px, -2px) rotate(-1deg); }
    }
    .${this.config.videoID}-reset-btn
    {
      width: 30px;
      height: 30px;  
      cursor: pointer; 
      margin-left: 15px;  
    }
    .${this.config.videoID}-reset-btn-rotation {
      animation: ${this.config.videoID}-reset-btn-rotation-animation 2s infinite linear;
      -webkit-animation: ${this.config.videoID}-reset-btn-rotation-animation 2s infinite linear;
    }
    @keyframes ${this.config.videoID}-reset-btn-rotation-animation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(359deg);
      }
    }
    .${this.config.videoID}-record-btn
    {
      width: 30px;
      height: 30px;  
      cursor: pointer;
    }
    .${this.config.videoID}-record-btn-blink {
      animation: ${this.config.videoID}-record-btn-blink-animation 1s steps(5, start) infinite;
      -webkit-animation: ${this.config.videoID}-record-btn-blink-animation 1s steps(5, start) infinite;
    }
    @keyframes ${this.config.videoID}-record-btn-blink-animation {
      to {
        visibility: hidden;
      }
    }
    @-webkit-keyframes ${this.config.videoID}-record-btn-blink-animation {
      to {
        visibility: hidden;
      }
    }
    .${this.config.videoID}-play-btn {
      width: 30px;
      height: 30px;
      position: relative;
      margin: auto;
      transform: rotate(-90deg) scale(0.8);
      transition: -webkit-clip-path 0.3s ease-in 0.1s, shape-inside 0.3s ease-in 0.1s,
        transform 0.8s cubic-bezier(0.85, -0.25, 0.25, 1.425);
        cursor: pointer;
    }
    .${this.config.videoID}-play-btn.${this.config.videoID}-paused {
      transform: rotate(0deg);
    }
    .${this.config.videoID}-play-btn:before,
    .${this.config.videoID}-play-btn:after {
      content: "";
      position: absolute;
      background: white;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transition: inherit;
    }
    .${this.config.videoID}-play-btn:before {
      -webkit-clip-path: polygon(0 10%, 100% 10%, 100% 40%, 0 40%);
      shape-inside: polygon(0 10%, 100% 10%, 100% 40%, 0 40%);
    }
    .${this.config.videoID}-play-btn:after {
      -webkit-clip-path: polygon(0 60%, 100% 60%, 100% 90%, 0 90%);
      shape-inside: polygon(0 60%, 100% 60%, 100% 90%, 0 90%);
    }
    .${this.config.videoID}-play-btn.${this.config.videoID}-paused:before {
      -webkit-clip-path: polygon(10% 0, 90% 51%, 90% 51%, 10% 51%);
      shape-inside: polygon(0 0, 100% 51%, 100% 51%, 0 51%);
    }
    .${this.config.videoID}-play-btn.${this.config.videoID}-paused:after {
      -webkit-clip-path: polygon(10% 49.5%, 80% 49.5%, 90% 49.5%, 10% 100%);
      shape-inside: polygon(10% 49.5%, 80% 49.5%, 90% 49.5%, 10% 100%);
    }
    ${this.config.videoID}-button:focus {
      outline: none;
    }
    .${this.config.videoID}-fullscreen {
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
   `;

    this.createStyle(style);

    this.canvas = document.getElementById(this.config.videoID);
    // this.renderContext = window.nw.require("webgl-video-renderer").setupCanvas(this.canvas);
    this.renderContext = setupCanvas(this.canvas);
    console.log('Status of renderConetxt', this.renderContext)
    // this.renderer = window.nw.require("wcjs-renderer");
    // console.log('Status of render', this.renderer);
    let vlcOptions = [
      "--no-audio",
      "--http-reconnect",
      // "--width=480",
      // "--height=360"
    ]
    this.webChimeraPlayer = window.nw.require("webchimera.js").createPlayer(vlcOptions);

    //ELEMENT SELECTORS
    this.progressSlider = document.querySelector(`.${this.config.videoID}-progress`);
    this.progressFill = document.querySelector(`.${this.config.videoID}-progress-filled`);
    this.textCurrent = document.querySelector(`.${this.config.videoID}-time-current`);
    this.textTotal = document.querySelector(`.${this.config.videoID}-time-total`);
    this.player = document.querySelector(`.${this.config.videoID}-player`);
    this.playBtn = document.querySelector(`.${this.config.videoID}-play-btn`);
    this.resetBtn = document.querySelector(`.${this.config.videoID}-reset-btn`);
    this.recordBtn = document.querySelector(`.${this.config.videoID}-record-btn`);
    this.snapshotBtn = document.querySelector(`.${this.config.videoID}-snapshot-btn`);
    this.fullscreenBtn = document.querySelector(`.${this.config.videoID}-fullscreen`);
    this.cssStringVar = this.config.videoID + '-speed-item' + " " + this.config.videoID + '-active';
    setTimeout(() => {
      this.speedBtns = document.querySelectorAll(`.${this.config.videoID}-speed-item`);
    }, 1000);

    if (this.config.autoPlay)
      this.togglePlay()
  }

  //PLAYER FUNCTIONS
  setSpeed(e, rate) {
    debugger
    this.speedBtns.forEach(speedBtn => {
      console.log(speedBtn)
      speedBtn.classList.remove(`${this.config.videoID}-active`)
    }
    );
    document.getElementById(e.srcElement.id).classList.add(`${this.config.videoID}-active`)
    this.webChimeraPlayer.input.rate = rate
  }
  private neatTime(time) {
    var minutes = Math.floor(time / 60000);
    var seconds = Number(((time % 60000) / 1000).toFixed(0));
    return (
      seconds == 60 ?
        (minutes + 1) + ":00" :
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
  }
  private updateProgress() {
    this.progressFill.style.width = `${this.currentTime / this.webChimeraPlayer.input.length * 100}%`;
    this.textCurrent.innerHTML = `${this.neatTime(this.currentTime)} / `;
  }
  setProgress(e) {
    const newTime = e.offsetX / this.progressSlider.offsetWidth;
    this.progressFill.style.width = `${newTime * 100}%`;
    console.log(this.webChimeraPlayer.input.length * newTime)
    this.webChimeraPlayer.input.time = newTime * this.webChimeraPlayer.input.length;
    this.currentTime = newTime * this.webChimeraPlayer.input.length;
  }
  togglePlay() {
    console.log(this.webChimeraPlayer)
    if (!this.webChimeraPlayer.playing) {
      this.playVideo()
    } else {
      this.pauseVideo()
    }
    this.playBtn.classList.toggle(`${this.config.videoID}-paused`);
  }
  private launchIntoFullscreen() {
    if (this.player.requestFullscreen) {
      this.player.requestFullscreen();
    } else if (this.player.mozRequestFullScreen) {
      this.player.mozRequestFullScreen();
    } else if (this.player.webkitRequestFullscreen) {
      this.player.webkitRequestFullscreen();
    } else if (this.player.msRequestFullscreen) {
      this.player.msRequestFullscreen();
    }
  }
  private exitFullscreen() {
    let self = <any>document;
    if (self.exitFullscreen) {
      self.exitFullscreen();
    } else if (self.mozCancelFullScreen) {
      self.mozCancelFullScreen();
    } else if (self.webkitExitFullscreen) {
      self.webkitExitFullscreen();
    }
  }
  toggleFullscreen() {
    console.log('fullscreen click')
    this.fullscreen ? this.exitFullscreen() : this.launchIntoFullscreen()
    this.fullscreen = !this.fullscreen;
  }
  private checkInterval() {
    console.log('Chạy Timeout check luồng')
    if (this.previousFrame == null && this.currentFrame != null) {
      //Lần đầu tiên, nếu chưa lưu previous frame thì skip phần check
      this.previousFrame = new Uint8ClampedArray(this.currentFrame);
      this.frameCheckTimeout = setTimeout(this.checkInterval.bind(this), 10000);
    }
    else {
      // let currentTime = moment().valueOf();
      // console.log(this.webChimeraPlayer)
      // let diff = currentTime - this.frameRecevingTime
      // console.log(diff)
      // if (diff >= 5000) {
      //   console.log('Chênh lệch giữa thời điểm hiện tại và last frame: ', diff)
      //   //Restart lại player 
      //   this.restartPlayer();
      // }
      if (this.currentFrame != null && this.previousFrame != null) {
        if (!this.typedArraysAreEqual(this.previousFrame, this.currentFrame)) {
          this.previousFrame = new Uint8ClampedArray(this.currentFrame);
          this.frameCheckTimeout = setTimeout(this.checkInterval.bind(this), 10000);
        }
        else {
          console.log('Frame cuối đã lưu và lastest giống nhau --> Player đã stop nhận frame. ' + `Restart lại player ${this.config.videoID} lúc ${new Date().toString()}`)
          this.restartPlayer()
        }
      }
    }
  }
  private typedArraysAreEqual(a, b) {
    if (a.byteLength !== b.byteLength) return false;
    return a.every((val, i) => val === b[i]);
  }
  //EVENT LISTENERS
  private playVideo() {
    console.log('Play hit!')
    this.statusTxt = 'Đang tải dữ liệu...'
    try {
      this.playerStopIntentionally = false
      let self = this;
      this.webChimeraPlayer.onLogMessage =
        function (level, message, format) {
          // console.log(message);
        }
      this.webChimeraPlayer.onStopped =
        function () {
          console.log('Player has been stopped ----------------');
          self.zone.run(() => {
            self.statusTxt = 'Luồng đã kết thúc...'
          });
          self.frameRecevingTime = null
          if (self.frameCheckTimeout != null)
            clearTimeout(self.frameCheckTimeout)

          if (self.config.autoRestart && !self.playerStopIntentionally) {
            setTimeout(() => {
              console.log(`Restart lại player ${self.config.videoID} lúc ${new Date().toString()} do sự cố mất luồng`);
              self.restartPlayer();
            }, 5000);
          }
        }
      this.webChimeraPlayer.onPlaying =
        function () {
          console.log('Start Playing ------------------------------------');
          self.zone.run(() => {
            self.statusTxt = 'Luồng đang chạy...'
          });
          self.currentFrame = null;
          self.previousFrame = null;
          if (self.frameCheckTimeout != null)
            clearTimeout(self.frameCheckTimeout)

          setTimeout(() => {
            if (!self.config.isPlayback && self.config.autoRestart)
              self.checkInterval();
          }, 10000);

        }
      this.webChimeraPlayer.onEndReached = function () {
        console.log('End of file');
        if (self.config.isPlayback) {
          self.playBtn.classList.toggle(`${self.config.videoID}-paused`);
          self.progressFill.style.width = `100%`;
          self.currentTime = 0;
          self.fpsCounter = 0;
        }
      }
      this.webChimeraPlayer.onFrameReady =
        function (frame) {
          // console.log(frame)
          // if (self.frameRecevingTime == null)
          self.currentFrame = frame

          self.frameRecevingTime = moment().valueOf();
          if (self.config.isPlayback) {
            if (!self.initSetup) {
              self.initSetup = true
              self.textTotal.innerHTML = self.neatTime(self.webChimeraPlayer.input.length);
              self.fps = Math.round(self.webChimeraPlayer.input.fps) + 3
            }
            self.fpsCounter += 1;
            if (self.fpsCounter == self.fps) {
              self.currentTime += 1000;
              self.fpsCounter = 0;
              self.updateProgress();
            }
          }
          try {
            if (self.renderContext === null || self.renderContext === undefined) { }
            else {
              if(self.windowHasFocus)
              self.renderContext.render(frame, frame.width, frame.height, frame.uOffset, frame.vOffset);
            }
          } catch (error) {
            console.log('Render error --------------------------------------')
            console.log(error)
          }
        }
      this.webChimeraPlayer.onPaused =
        function () {
          console.log('Player đã paused do luồng bị ngừng nhưng hls vẫn chạy')
        }
      this.webChimeraPlayer.onEncounteredError =
        function (error) {
          console.log('vlc error', error)
        }
      if (this.renderContext === null || this.renderContext === undefined) {
        bind(this.canvas, this.webChimeraPlayer, this.rendererOption);
      }
      if (this.config.isPlayback) {
        if (this.currentTime > 0) {
          this.webChimeraPlayer.play();
          this.webChimeraPlayer.input.time = this.currentTime
        }
        else {
          this.progressFill.style.width = `0%`;
          this.webChimeraPlayer.play(this.config.url);
        }
      }
      else
        this.webChimeraPlayer.play(this.config.url)
    } catch (error) {
      console.log(error)
    }
  };
  private pauseVideo() {
    this.statusTxt = 'Luồng đang tạm dừng ...'
    if (this.frameCheckTimeout != null)
      clearTimeout(this.frameCheckTimeout);
    if (this.webChimeraPlayer.playing) {
      console.log('Stop hit!')
      this.playerStopIntentionally = true;
      if (this.config.isPlayback) {
        this.webChimeraPlayer.stop();
      }
      else {
        try {
          this.webChimeraPlayer.stop();
          if (this.renderContext === null || this.renderContext === undefined) {
            rendererClear(this.canvas)
          }
          else
            this.renderContext.fillBlack()
        } catch (error) {
          console.log(error)
        }
      }
    }
  };
  private createStyle(style: string): void {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(style));
    this.el.nativeElement.appendChild(styleElement);
  }
  ngOnDestroy() {
    this.pauseVideo();
  }
  restartPlayer() {
    this.statusTxt = 'Luồng đang khởi động lại ...'
    this.frameRecevingTime = null
    if (this.frameCheckTimeout != null)
      clearTimeout(this.frameCheckTimeout)

    console.log('Restart Hit --------------')
    this.resetBtn.classList.add(`${this.config.videoID}-reset-btn-rotation`);

    if (!this.playBtn.classList.contains(`${this.config.videoID}-paused`))
      this.playBtn.classList.add(`${this.config.videoID}-paused`)

    if (this.config.isPlayback) {
      this.progressFill.style.width = `100%`;
      this.currentTime = 0;
      this.fpsCounter = 0;
    }

    this.pauseVideo();

    setTimeout(() => {
      this.togglePlay();
    }, 1000);

    setTimeout(() => {
      this.resetBtn.classList.remove(`${this.config.videoID}-reset-btn-rotation`);
    }, 3000);
  }
  recordPlayback() {
    if (!this.isRecording && this.webChimeraPlayer.playing) {
      this.isRecording = true;
      let startTime

      this.recordBtn.classList.add(`${this.config.videoID}-record-btn-blink`);

      this.videoStream = this.canvas.captureStream(30);
      this.mediaRecorder = new MediaRecorder(this.videoStream);

      let self = this;
      this.recordedChunk = [];
      this.mediaRecorder.ondataavailable = function (e) {
        self.recordedChunk.push(e.data);
      };

      this.mediaRecorder.onstop = function (e) {
        let duration = Date.now() - startTime;

        let a = document.createElement("a") as HTMLAnchorElement;
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none;');

        let blobHasNoTime = new Blob(self.recordedChunk, { 'type': 'video/webm' });

        fixWebmDuration(blobHasNoTime, duration, { logger: false })
          .then(function (fixedBlob) {
            let videoURL = URL.createObjectURL(fixedBlob);
            a.href = videoURL;
            a.download = new Date().toLocaleTimeString();
            a.click();
            window.URL.revokeObjectURL(videoURL);
            self.recordedChunk = [];
          });
      };
      this.mediaRecorder.start();
      startTime = Date.now();
    }
    else {
      if (this.mediaRecorder != null) {
        this.mediaRecorder.stop();
        this.mediaRecorder = null;
        this.videoStream = null;
      }
      this.isRecording = false;
      this.recordBtn.classList.remove(`${this.config.videoID}-record-btn-blink`)
    }
  }
  private snapshotTaking() {
    if (this.webChimeraPlayer.playing) {

      this.snapshotBtn.classList.add(`${this.config.videoID}-snapshot-btn-shake`);

      console.log('Taking SnapShot ------------------------------');
      this.webChimeraPlayer.pixelFormat = this.webChimeraPlayer.RV32;
      //Clone currentFrame 1st
      let frame = new Uint8Array(this.currentFrame);
      //Put current Frame onto a hidden canvas
      let snapshotCanvas = document.createElement("canvas") as HTMLCanvasElement
      let ctx = snapshotCanvas.getContext("2d");
      var width = this.currentFrame.width;
      var height = this.currentFrame.height;
      let imgData = ctx.createImageData(width, height);
      var buf = imgData.data;
      for (var i = 0; i < height; ++i) {
        for (var j = 0; j < width; ++j) {
          var o = (j + (width * i)) * 4;
          buf[o + 0] = frame[o + 2];
          buf[o + 1] = frame[o + 1];
          buf[o + 2] = frame[o + 0];
          buf[o + 3] = frame[o + 3];
        }
      };
      ctx.putImageData(imgData, 0, 0);
      let a = document.createElement("a") as HTMLAnchorElement;
      let imgURL = snapshotCanvas.toDataURL('image/png', 1.0);
      console.log(imgURL)
      a.href = imgURL;
      a.download = new Date().toLocaleTimeString();
      a.click();
      a.remove();
      this.webChimeraPlayer.pixelFormat = this.webChimeraPlayer.I420;

      setTimeout(() => {
        this.snapshotBtn.classList.remove(`${this.config.videoID}-snapshot-btn-shake`);
      }, 500);
    }
  }
  snapshotTakingFromRecord() {
    if (this.webChimeraPlayer.playing) {
      this.snapshotBtn.classList.add(`${this.config.videoID}-snapshot-btn-shake`);

      console.log('Taking SnapShot ------------------------------');

      let videoStream = this.canvas.captureStream(24);
      let mediaRecorder = new MediaRecorder(videoStream);

      let self = this;
      let recordedChunk = [];
      mediaRecorder.ondataavailable = function (e) {
        recordedChunk.push(e.data);
      };

      mediaRecorder.onstop = function (e) {
        let video = document.createElement("video") as HTMLVideoElement;
        video.autoplay = false;
        video.loop = false;
        video.setAttribute('style', 'display: none;');
        video.addEventListener("loadeddata", function () {
          // Let's wait another 100ms just in case?
          setTimeout(function () {
            // Create a canvas element, this is what user sees.
            let canvas = document.createElement("canvas") as HTMLCanvasElement;
            // Set it to same dimensions as video.
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Get the drawing context for canvas.
            var ctx = canvas.getContext("2d");

            // Draw the current frame of video onto canvas.
            ctx.drawImage(video, 0, 0);

            let a = document.createElement("a") as HTMLAnchorElement;
            a.setAttribute('style', 'display: none;');
            a.href = canvas.toDataURL('image/png', 1.0);
            a.download = new Date().toLocaleTimeString();
            a.click();
            window.URL.revokeObjectURL(videoURL);
            a.remove();
          });
        }, false);

        let blob = new Blob(recordedChunk, { 'type': 'video/mp4' });
        let videoURL = URL.createObjectURL(blob);
        video.src = videoURL;
        recordedChunk = [];
      };
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        this.snapshotBtn.classList.remove(`${this.config.videoID}-snapshot-btn-shake`);
      }, 500);
    }
  }
  changeImgSource(event, newSrc) {
    event.target.src = newSrc;
  }
}
