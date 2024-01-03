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

  scenesTimeline$: Observable<Scene[]> = this.videoService.scenesTimeline$;

  constructor(public videoService: VideoService) {}

  ngAfterViewInit() {
    this.videoService.setVideoPlayer(this.videoPlayer.nativeElement);
  }
}
