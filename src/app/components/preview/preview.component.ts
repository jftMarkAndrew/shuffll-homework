import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scene } from '../../services/dnd.service';
import { VideoService } from '../../services/video.service';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements AfterViewInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

  isPlaying = false;
  scenesTimeline$: Observable<Scene[]> = this.videoService.scenesTimeline$;
  currentVideo: Scene | null = null;

  constructor(private videoService: VideoService) {}

  ngAfterViewInit() {
    this.videoService.setVideoPlayer(this.videoPlayer.nativeElement);
  }

  /* togglePlay(): void {
    this.isPlaying = !this.isPlaying;

    if (!this.isPlaying) {
      this.scenesTimeline$.subscribe((scenesTimeline) => {
        this.videoService.playPreview(scenesTimeline);
      });
    } else {
      this.pausePreview();
    }
  }

  pausePreview(): void {
    this.currentVideo = null;
    this.isPlaying = false;
    this.videoPlayer.nativeElement.pause();
    this.videoPlayer.nativeElement.src = '';
  } */
}
