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
  private scenesTimelineSubject = new BehaviorSubject<Scene[]>([]);
  scenesTimeline$: Observable<Scene[]> =
    this.scenesTimelineSubject.asObservable();

  constructor() {}

  private videoPlayer: HTMLVideoElement | null = null;

  setVideoPlayer(videoPlayer: HTMLVideoElement | null) {
    this.videoPlayer = videoPlayer;
  }

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

  playPreview(scenesTimeline: Scene[]) {
    console.log('Starting playing videos in this order:', scenesTimeline);

    let currentIndex = 0;

    const playNextVideo = () => {
      if (currentIndex < scenesTimeline.length) {
        const scene = scenesTimeline[currentIndex];
        console.log(`Playing video ${scene.url}`);

        this.videoPlayer?.setAttribute('src', scene.url);
        this.videoPlayer?.load();
        this.videoPlayer?.play();

        currentIndex++;

        if (currentIndex === scenesTimeline.length) {
          setTimeout(() => this.pausePreview(), scene.duration * 1000);
        } else {
          setTimeout(playNextVideo, scene.duration * 1000);
        }
      } else {
        this.pausePreview();
      }
    };

    playNextVideo();
  }

  public pausePreview() {
    console.log('Pausing preview');
  }
}
