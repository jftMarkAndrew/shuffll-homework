import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../services/video.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

interface Scene {
  title: string;
  duration: number;
  url: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  constructor(private videoService: VideoService) {}

  scenesTimeline: Scene[] = [];

  isPlaying = false;

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying === true) {
      if (this.scenesTimeline.length > 0) {
        this.videoService.playPreview(this.scenesTimeline);
      } else {
        console.log('Nothing should happen!');
      }
    }
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  onDropScene(event: CdkDragDrop<Scene[]>) {
    this.isPlaying = false;
    this.videoService.drop(event);
    console.log('Timeline Container Data:', this.scenesTimeline);
  }

  onDeleteScene(scene: Scene): void {
    this.isPlaying = false;
    const index = this.scenesTimeline.indexOf(scene);
    if (index !== -1) {
      this.scenesTimeline.splice(index, 1);
      console.log('Timeline Container Data:', this.scenesTimeline);
    }
  }
}
