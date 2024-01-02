import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Scene } from './dnd.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor() {}

  scenesTimelineSubject = new BehaviorSubject<Scene[]>([]);
  scenesTimeline$: Observable<Scene[]> =
    this.scenesTimelineSubject.asObservable();
  videoPlayer: HTMLVideoElement | null = null;
  currentScene: Scene | null = null;
  isPreviewPlaying: boolean = false;

  setVideoPlayer(videoPlayer: HTMLVideoElement | null) {
    this.videoPlayer = videoPlayer;
  }

  playScene(scene: Scene) {
    this.isPreviewPlaying = false;
    if (this.videoPlayer) {
      this.videoPlayer.pause();
    }

    if (
      this.videoPlayer &&
      this.videoPlayer.paused &&
      this.currentScene?.url === scene.url
    ) {
      this.videoPlayer.play();
      console.log('Resuming preview');
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
      console.log(`Paused scene: ${this.currentScene.title}`);
    }
  }

  isScenePlaying(scene: Scene): boolean {
    if (this.isPreviewPlaying) return false;
    return this.currentScene === scene && !this.videoPlayer!.paused;
  }

  async playPreview(scenesTimeline: Scene[], startTime?: number) {
    console.log('Starting playing videos in this order:', scenesTimeline);
    this.pauseScene();
    this.isPreviewPlaying = true;

    let currentIndex = 0;
    let accumulatedTime = 0;

    while (
      currentIndex < scenesTimeline.length &&
      accumulatedTime + scenesTimeline[currentIndex].duration <= startTime!
    ) {
      accumulatedTime += scenesTimeline[currentIndex].duration;
      currentIndex++;
    }

    const playNextVideo = async () => {
      if (currentIndex < scenesTimeline.length && this.isPreviewPlaying) {
        const scene = scenesTimeline[currentIndex];
        console.log(`Playing video ${scene.url}`);

        if (this.videoPlayer) {
          this.videoPlayer.setAttribute('src', scene.url);
          this.videoPlayer.load();

          if (this.videoPlayer.currentTime !== undefined) {
            this.videoPlayer.currentTime = startTime
              ? Math.max(0, startTime - accumulatedTime)
              : 0;
          }

          this.videoPlayer.play();

          currentIndex++;

          if (currentIndex < scenesTimeline.length) {
            const remainingTime =
              scene.duration -
              (startTime ? Math.max(0, startTime - accumulatedTime) : 0);
            await this.delay(remainingTime * 1000);
            accumulatedTime += scene.duration;
            await playNextVideo();
          }
        }
      } else {
        this.pausePreview();
      }
    };

    await playNextVideo();
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  pausePreview() {
    this.isPreviewPlaying = false;
    if (this.videoPlayer && !this.videoPlayer.paused) {
      this.videoPlayer.pause();
      console.log('Pausing preview');
    }
  }
}
