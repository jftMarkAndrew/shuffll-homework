import { Injectable } from '@angular/core';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Scene {
  title: string;
  duration: number;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor() {}
  private scenesTimelineSubject = new BehaviorSubject<Scene[]>([]);
  scenesTimeline$: Observable<Scene[]> =
    this.scenesTimelineSubject.asObservable();
  private videoPlayer: HTMLVideoElement | null = null;
  private currentScene: Scene | null = null;

  public drop(event: CdkDragDrop<Scene[]>) {
    if (
      event.previousContainer !== event.container &&
      event.previousContainer.id === 'scenes' &&
      event.container.id === 'timeline'
    ) {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log('Timeline Container Data:', event.container.data);
      this.scenesTimelineSubject.next(event.container.data);
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.container.id === 'timeline') {
        console.log('Timeline Container Data:', event.container.data);
        this.scenesTimelineSubject.next(event.container.data);
      }
    }
  }

  setVideoPlayer(videoPlayer: HTMLVideoElement | null) {
    this.videoPlayer = videoPlayer;
  }

  playScene(scene: Scene) {
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
    return this.currentScene === scene && !this.videoPlayer!.paused;
  }

  continuePlaying: boolean = true;

  async playPreview(scenesTimeline: Scene[], startTime?: number) {
    console.log('Starting playing videos in this order:', scenesTimeline);

    let currentIndex = 0;
    let resumeTime = startTime || 0;

    const playNextVideo = async () => {
      if (currentIndex < scenesTimeline.length && this.continuePlaying) {
        const scene = scenesTimeline[currentIndex];
        console.log(`Playing video ${scene.url}`);

        if (this.videoPlayer) {
          this.videoPlayer.setAttribute('src', scene.url);
          this.videoPlayer.load();

          if (this.videoPlayer.currentTime !== undefined) {
            this.videoPlayer.currentTime = resumeTime;
          }

          this.videoPlayer.play();

          currentIndex++;

          if (currentIndex === scenesTimeline.length) {
            await this.delay(scene.duration * 1000 - resumeTime * 1000);
            this.pausePreview();
          } else {
            await this.delay(scene.duration * 1000 - resumeTime * 1000);
            await playNextVideo();
          }
        }
      } else {
        this.pausePreview();
      }
    };

    await playNextVideo();
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  pausePreview() {
    this.continuePlaying = false;
    if (this.videoPlayer && !this.videoPlayer.paused) {
      this.videoPlayer.pause();
      console.log('Pausing preview');
    }
  }

  resumePreview() {
    this.continuePlaying = true;
    if (this.videoPlayer && this.videoPlayer.paused) {
      this.videoPlayer.play();
      console.log('Resuming preview');
    }
  }
}
