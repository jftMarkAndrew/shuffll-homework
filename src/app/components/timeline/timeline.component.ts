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
  zoomFactor: number = 1.25;
  zoom: number = 0;
  isNull = true;
  private subscription?: Subscription;

  getSteps(number: number): number[] {
    return Array.from({ length: number }, (_, i) => i);
  }

  startCursorMovement() {
    this.subscription = interval(1000).subscribe(() => {
      this.cursorPosition += this.stepSize;
      if (this.cursorPosition / this.stepSize >= 1600 / this.stepSize) {
        this.stopCursorMovement();
      }
    });
  }

  stopCursorMovement() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setCursorPosition(index: number) {
    this.cursorPosition = index * this.stepSize;
    console.log(this.cursorPosition / this.stepSize);
  }

  zoomIn() {
    if (this.zoom <= 5) {
      this.zoom++;
      const previousCursorPosition = this.cursorPosition / this.stepSize;
      this.stepSize *= this.zoomFactor;
      this.cursorPosition = previousCursorPosition * this.stepSize;
    }
  }

  zoomOut() {
    if (this.zoom >= -5) {
      this.zoom--;
      const previousCursorPosition = this.cursorPosition / this.stepSize;
      this.stepSize /= this.zoomFactor;
      this.cursorPosition = previousCursorPosition * this.stepSize;
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
      this.videoService.playPreview(
        this.scenesTimeline,
        this.cursorPosition / this.stepSize
      );
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
