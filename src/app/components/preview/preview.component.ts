import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { MatIconModule } from '@angular/material/icon';

interface Scene {
  title: string;
  duration: number;
  url: string;
}

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent {
  constructor(private videoService: VideoService) {
    this.videoService.registerPreviewComponent(this);
  }

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  isPlaying = false;
  scenesTimeline: Scene[] = [];
  currentVideo: Scene | null = null;

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.playVideosInOrder();
    } else {
      this.pausePreview();
    }
  }

  playPreview(scenesTimeline: Scene[], time?: number): void {
    this.scenesTimeline = scenesTimeline;
    this.playVideosInOrder();
  }

  playVideosInOrder(): void {
    let currentIndex = 0;

    const playNextVideo = () => {
      if (currentIndex < this.scenesTimeline.length) {
        this.currentVideo = this.scenesTimeline[currentIndex];
        this.videoPlayer.nativeElement.src = this.currentVideo.url;
        this.videoPlayer.nativeElement.play();
        currentIndex++;
        setTimeout(() => playNextVideo(), this.currentVideo.duration * 1000);
      } else {
        this.pausePreview();
      }
    };

    playNextVideo();
  }

  pausePreview(): void {
    this.currentVideo = null;
    this.isPlaying = false;
    this.videoPlayer.nativeElement.pause();
    this.videoPlayer.nativeElement.src = '';
  }
}
