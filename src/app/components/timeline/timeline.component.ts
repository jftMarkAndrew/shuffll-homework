import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
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
    this.subscription = new Subscription();

    this.subscription.add(
      this.videoService.scenesTimeline$.subscribe((scenes) => {
        this.scenesTimeline = scenes;
      })
    );

    this.subscription.add(
      this.videoService.isPreviewPlaying$.subscribe((isPreviewPlaying) => {
        this.isPlaying = isPreviewPlaying;
      })
    );

    this.subscription.add(
      this.videoService.stopCursorMovementSubject.subscribe(() => {
        this.stopCursorMovement();
      })
    );
  }

  subscription?: Subscription;

  isPlaying: boolean = false;
  cursorPosition: number = 0;

  stepSize: number = 64;
  zoom: number = 0;
  zoomFactor: number = 1.25;

  minContentWidth: number = 3840;
  contentWidth: number = 3840;
  lastScrollPosition: number = 0;

  scenesTimeline: Scene[] = [];
  pointsOfInterest: number[] = [];
  previewDuration: number = 0;

  @ViewChild('timeline', { static: true }) timeline!: ElementRef;
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const timelineGridElement = this.timeline.nativeElement;
    const scrollPosition = timelineGridElement.scrollLeft;

    if (
      scrollPosition < this.lastScrollPosition &&
      this.contentWidth >= this.minContentWidth
    ) {
      this.contentWidth -= this.stepSize * 1.25;
    } else if (scrollPosition > this.lastScrollPosition) {
      this.contentWidth += this.stepSize * 1;
    }
    this.lastScrollPosition = scrollPosition;
  }

  getSteps(number: number): number[] {
    return Array.from({ length: this.contentWidth / number }, (_, i) => i);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  togglePlay() {
    if (!(this.previewDuration === 0)) {
      this.isPlaying = !this.isPlaying;

      if (this.isPlaying) {
        this.videoService.playPreview(
          this.scenesTimeline,
          this.pointsOfInterest,
          this.cursorPosition / this.stepSize
        );
        this.startCursorMovement();
      } else {
        this.videoService.pausePreview();
        this.stopCursorMovement();
      }
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

  onDropScene(event: CdkDragDrop<Scene[]>) {
    this.dndService.drop(event);
    this.getPointsOfInterest(this.scenesTimeline);
    if (this.isPlaying) {
      this.videoService.playPreview(
        this.scenesTimeline,
        this.pointsOfInterest,
        parseFloat((this.cursorPosition / this.stepSize).toFixed(1))
      );
    }
  }

  onDeleteScene(scene: Scene): void {
    this.isPlaying = false;
    const index = this.scenesTimeline.indexOf(scene);
    if (index !== -1) {
      this.scenesTimeline.splice(index, 1);
      this.getPointsOfInterest(this.scenesTimeline);
    }
    if (this.cursorPosition / this.stepSize > this.previewDuration) {
      this.cursorPosition = this.stepSize * this.previewDuration;
    }
  }

  getPointsOfInterest(array: Scene[]) {
    this.previewDuration = 0;
    this.pointsOfInterest = [0];
    array.forEach((scene) => {
      this.previewDuration += scene.duration;
      this.pointsOfInterest.push(this.previewDuration);
    });
  }

  startCursorMovement() {
    this.subscription = interval(100).subscribe(() => {
      if (this.cursorPosition / this.stepSize >= this.previewDuration) {
        this.stopCursorMovement();
        this.togglePlay();
      } else {
        this.cursorPosition += this.stepSize / 10;
      }
      if (
        this.pointsOfInterest.includes(
          parseFloat((this.cursorPosition / this.stepSize).toFixed(1))
        )
      ) {
        this.videoService.playPreview(
          this.scenesTimeline,
          this.pointsOfInterest,
          parseFloat((this.cursorPosition / this.stepSize).toFixed(1))
        );
      }
    });
  }

  setCursorPosition(index: number) {
    this.cursorPosition = index * this.stepSize;
    if (this.cursorPosition / this.stepSize > this.previewDuration) {
      this.cursorPosition = this.stepSize * this.previewDuration;
    }
    if (this.isPlaying) {
      this.videoService.pausePreview();
      this.stopCursorMovement();
      this.videoService.playPreview(
        this.scenesTimeline,
        this.pointsOfInterest,
        this.cursorPosition / this.stepSize
      );
      this.startCursorMovement();
    }
  }

  stopCursorMovement() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
