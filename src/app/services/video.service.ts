import { Injectable } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

interface Scene {
  title: string;
  duration: number;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor() {}

  public drop(event: CdkDragDrop<Scene[]>) {
    if (
      event.previousContainer !== event.container &&
      event.previousContainer.id === 'scenes' &&
      event.container.id === 'timeline'
    ) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log('Timeline Container Data:', event.container.data);
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.container.id === 'timeline') {
        console.log('Timeline Container Data:', event.container.data);
      }
    }
  }
}
