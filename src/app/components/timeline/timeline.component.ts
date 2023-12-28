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

  scenesUsed: Scene[] = [];

  isPlaying = false;

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  onDrop(event: CdkDragDrop<Scene[]>) {
    this.videoService.drop(event);
  }

  onDeleteScene(scene: Scene): void {
    const index = this.scenesUsed.indexOf(scene);
    if (index !== -1) {
      this.scenesUsed.splice(index, 1);
    }
  }
}
