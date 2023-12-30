import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndService, Scene } from '../../services/dnd.service';
import { VideoService } from '../../services/video.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnDestroy {
  scenesTimeline: Scene[] = [];
  isPlaying = false;
  isNull = true;
  private subscription?: Subscription;

  constructor(
    private dndService: DndService,
    private videoService: VideoService
  ) {
    this.subscription = this.videoService.scenesTimeline$.subscribe(
      (scenes) => {
        this.scenesTimeline = scenes;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.videoService.playPreview(this.scenesTimeline, 4);
    } else {
      this.videoService.pausePreview();
    }
  }

  test() {
    this.videoService.resumePreview();
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  onDropScene(event: CdkDragDrop<Scene[]>) {
    this.isPlaying = false;
    this.dndService.drop(event);
  }

  onDeleteScene(scene: Scene): void {
    this.isPlaying = false;
    const index = this.scenesTimeline.indexOf(scene);
    if (index !== -1) {
      this.scenesTimeline.splice(index, 1);
    }
  }
}
