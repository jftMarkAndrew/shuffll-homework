import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  CdkDragEnd,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { VideoService, Scene } from '../../services/video.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [MatIconModule, CommonModule, DragDropModule],
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent {
  constructor(private videoService: VideoService) {}

  isPlaying = false;

  togglePlay(scene: Scene): void {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.videoService.playPreview([scene]);
    } else {
      this.videoService.pausePreview();
    }
  }

  scenes: Scene[] = [
    {
      title: 'The Very 1st Scene.',
      duration: 3,
      url: 'assets/video/v1.mp4',
    },
    {
      title: 'This is a Boring 2nd Scene...',
      duration: 4,
      url: 'assets/video/v2.mp4',
    },
    {
      title: 'Finally the Awesome 3rd Scene!',
      duration: 5,
      url: 'assets/video/v3.mp4',
    },
  ];

  onDropScene(event: CdkDragDrop<Scene[]>): void {
    this.videoService.drop(event);
  }

  onDragEnd(event: CdkDragEnd): void {
    event.source.data = null;
  }
}
