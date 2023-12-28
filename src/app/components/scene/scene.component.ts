import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  CdkDragEnd,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { VideoService } from '../../services/video.service';

interface Scene {
  title: string;
  duration: number;
  url: string;
}
@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [MatIconModule, CommonModule, DragDropModule],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss',
})
export class SceneComponent {
  constructor(private videoService: VideoService) {}

  @Input() items: Scene[] | undefined;
  @Input() title = 'Scene';
  @Input() duration = 3;
  isPlaying = false;

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  scenes: Scene[] = [
    {
      title: 'The Very 1st Scene.',
      duration: 5,
      url: '../../../../src/assets/video/v1.mp4',
    },
    {
      title: 'This is a Boring 2nd Scene...',
      duration: 5,
      url: '../../../../src/assets/video/v2.mp4',
    },
    {
      title: 'Finally the Awesome 3rd Scene!',
      duration: 5,
      url: '../../../../src/assets/video/v3.mp4',
    },
    {
      title: 'The Very 1st Scene.',
      duration: 5,
      url: '../../../../src/assets/video/v1.mp4',
    },
    {
      title: 'This is a Boring 2nd Scene...',
      duration: 5,
      url: '../../../../src/assets/video/v2.mp4',
    },
    {
      title: 'Finally the Awesome 3rd Scene!',
      duration: 5,
      url: '../../../../src/assets/video/v3.mp4',
    },
  ];

  onDrop(event: CdkDragDrop<Scene[]>) {
    this.videoService.drop(event);
  }

  onDragEnd(event: CdkDragEnd) {
    event.source.data = null;
  }
}
