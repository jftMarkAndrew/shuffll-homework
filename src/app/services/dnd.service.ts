import { Injectable } from '@angular/core';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';

export interface Scene {
  title: string;
  duration: number;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class DndService {
  constructor() {}

  scenesTimelineSubject = new BehaviorSubject<Scene[]>([]);

  drop(event: CdkDragDrop<Scene[]>) {
    if (
      event.previousContainer !== event.container &&
      event.previousContainer.id === 'scenes' &&
      event.container.id === 'timeline'
    ) {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.scenesTimelineSubject.next(event.container.data);
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.container.id === 'timeline') {
        this.scenesTimelineSubject.next(event.container.data);
      }
    }
  }
}
