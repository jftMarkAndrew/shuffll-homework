import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndService, Scene } from '../../services/dnd.service';
import { VideoService } from '../../services/video.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, interval } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    ScrollingModule,
    TruncatePipe,
  ],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnDestroy {
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

  arrayDuration: number = 0;
  scenesTimeline: Scene[] = [];
  isPlaying: boolean = false;
  cursorPosition: number = 0;
  stepSize: number = 64;
  zoomFactor: number = 1.25;
  zoom: number = 0;
  isNull = true;
  subscription?: Subscription;

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getSteps(number: number): number[] {
    return Array.from({ length: 38400 / number }, (_, i) => i);
  }

  onDropScene(event: CdkDragDrop<Scene[]>) {
    this.isPlaying = false;
    this.dndService.drop(event);
    this.setArrayDuration(this.scenesTimeline);
  }

  onDeleteScene(scene: Scene): void {
    this.isPlaying = false;
    const index = this.scenesTimeline.indexOf(scene);
    if (index !== -1) {
      this.scenesTimeline.splice(index, 1);
      this.setArrayDuration(this.scenesTimeline);
    }
    if (this.cursorPosition / this.stepSize > this.arrayDuration) {
      this.cursorPosition = this.stepSize * this.arrayDuration;
    }
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

  startCursorMovement() {
    this.subscription = interval(100).subscribe(() => {
      if (this.cursorPosition / this.stepSize >= this.arrayDuration) {
        this.stopCursorMovement();
      } else {
        this.cursorPosition += this.stepSize / 10;
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
    if (this.cursorPosition / this.stepSize > this.arrayDuration) {
      this.cursorPosition = this.stepSize * this.arrayDuration;
    }
    console.log(this.cursorPosition / this.stepSize);
  }

  setArrayDuration(array: Scene[]) {
    this.arrayDuration = 0;

    for (const scene of array) {
      this.arrayDuration += scene.duration;
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
}
