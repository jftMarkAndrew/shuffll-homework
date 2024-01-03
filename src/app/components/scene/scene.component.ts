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
import mockScenes from '../../../assets/data/mockScenes.json';

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

  mockScenes: Scene[] = mockScenes;

  togglePlay(scene: Scene): void {
    if (!this.videoService.getIsScenePlaying(scene)) {
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
