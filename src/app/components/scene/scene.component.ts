import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  CdkDragEnd,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { DndService, Scene } from '../../services/dnd.service';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [MatIconModule, CommonModule, DragDropModule],
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent {
  constructor(
    private dndService: DndService,
    public videoService: VideoService
  ) {}

  mockScenes: Scene[] = [
    {
      title: 'The Very 1st Scene.',
      duration: 4,
      url: 'assets/video/mockVideo1.mp4',
    },
    {
      title: 'This is a Boring 2nd Scene...',
      duration: 5,
      url: 'assets/video/mockVideo2.mp4',
    },
    {
      title: 'Finally the Awesome 3rd Scene!',
      duration: 3,
      url: 'assets/video/mockVideo3.mp4',
    },
  ];

  togglePlay(scene: Scene): void {
    if (!this.videoService.isScenePlaying(scene)) {
      this.videoService.playScene(scene);
    } else {
      this.videoService.pauseScene();
    }
  }

  onDropScene(event: CdkDragDrop<Scene[]>): void {
    this.dndService.drop(event);
  }

  onDragEnd(event: CdkDragEnd): void {
    event.source.data = null;
  }
}
