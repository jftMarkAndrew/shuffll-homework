import { Injectable } from '@angular/core';
import { Scene } from './dnd.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor() {}

  videoPlayer: HTMLVideoElement | null = null;

  showPicture: boolean = true;
  currentScene: Scene | null = null;

  scenesTimelineSubject = new BehaviorSubject<Scene[]>([]);
  scenesTimeline$: Observable<Scene[]> =
    this.scenesTimelineSubject.asObservable();

  isScenePlayingSubject = new BehaviorSubject<boolean>(false);
  isScenePlaying$: Observable<boolean> =
    this.isScenePlayingSubject.asObservable();

  isPreviewPlayingSubject = new BehaviorSubject<boolean>(false);
  isPreviewPlaying$: Observable<boolean> =
    this.isPreviewPlayingSubject.asObservable();

  isScenePlaying: boolean = false;
  isPreviewPlaying: boolean = false;

  getIsScenePlaying(scene: Scene): boolean {
    if (this.isPreviewPlaying) return false;
    return this.currentScene === scene && !this.videoPlayer!.paused;
  }

  getIsPreviewPlaying(): boolean {
    if (this.isScenePlaying) return false;
    return true;
  }

  setVideoPlayer(videoPlayer: HTMLVideoElement | null) {
    this.videoPlayer = videoPlayer;
  }

  playScene(scene: Scene) {
    this.showPicture = false;

    if (this.videoPlayer) {
      this.videoPlayer.pause();
    }

    this.isPreviewPlaying = false;

    if (
      this.videoPlayer &&
      this.videoPlayer.paused &&
      this.currentScene?.url === scene.url
    ) {
      this.videoPlayer.play();
    } else if (this.videoPlayer) {
      this.videoPlayer.src = scene.url;
      this.videoPlayer.load();
      this.videoPlayer.play();
      this.currentScene = scene;
    }

    if (this.videoPlayer) {
      this.videoPlayer.addEventListener('ended', () => {
        this.currentScene = null;
      });
    }
  }

  pauseScene() {
    if (this.videoPlayer && this.currentScene) {
      this.videoPlayer.pause();
    }
  }

  playPreview(
    scenesTimeline: Scene[],
    pointsOfInterest: number[],
    startTime: number
  ) {
    if (!(startTime >= pointsOfInterest[pointsOfInterest.length - 1])) {
      this.showPicture = false;
      this.pauseScene();
      this.isPreviewPlaying = true;

      if (this.videoPlayer) {
        let chosenIndex = 0;

        for (let i = 0; i < pointsOfInterest.length; i++) {
          if (startTime < pointsOfInterest[i]) {
            chosenIndex = i - 1;
            break;
          }
        }

        if (startTime >= pointsOfInterest[pointsOfInterest.length - 1]) {
          chosenIndex = pointsOfInterest.length - 1;
        }

        const chosenStartTime = startTime - pointsOfInterest[chosenIndex];

        if (this.videoPlayer && this.videoPlayer.currentTime !== undefined) {
          this.videoPlayer.src = scenesTimeline[chosenIndex].url;

          this.videoPlayer.addEventListener('loadedmetadata', () => {
            if (
              this.videoPlayer &&
              this.videoPlayer.currentTime !== undefined
            ) {
              this.videoPlayer.currentTime = chosenStartTime;
            }
            if (this.videoPlayer) {
              this.videoPlayer.play();
            }
          });

          this.videoPlayer.load();
        }
      }
    }
  }

  pausePreview() {
    this.isPreviewPlaying = false;
    if (this.videoPlayer && !this.videoPlayer.paused) {
      this.videoPlayer.pause();
    }
  }
}
