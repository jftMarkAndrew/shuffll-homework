import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndService, Scene } from '../../services/dnd.service';
import { VideoService } from '../../services/video.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnDestroy {
  scenesTimeline: Scene[] = [];
  isPlaying: boolean = false;
  cursorPosition: number = 0;
  stepSize: number = 64;
  isNull = true;
  private subscription?: Subscription;

  getSteps(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  startCursorMovement() {
    this.subscription = interval(1000).subscribe(() => {
      this.cursorPosition += this.stepSize;
    });
  }

  stopCursorMovement() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

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
      this.videoService.playPreview(this.scenesTimeline, 0);
      this.startCursorMovement();
    } else {
      this.videoService.pausePreview();
      this.stopCursorMovement();
    }
  }

  test() {
    this.videoService.resumePreview();
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
