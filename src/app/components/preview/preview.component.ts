import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../services/video.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements AfterViewInit {
  constructor(public videoService: VideoService) {}

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

  ngAfterViewInit() {
    this.videoService.setVideoPlayer(this.videoPlayer.nativeElement);
  }
}
