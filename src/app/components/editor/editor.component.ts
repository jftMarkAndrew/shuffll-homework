import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SceneComponent } from '../scene/scene.component';
import { PreviewComponent } from '../preview/preview.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

interface Scene {
  title: string;
  duration: number;
  url: string;
}

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  imports: [
    HeaderComponent,
    SceneComponent,
    PreviewComponent,
    TimelineComponent,
    DragDropModule,
  ],
})
export class EditorComponent {
  items: Scene[] = [
    {
      title: 'Scene 1',
      duration: 5,
      url: '../../../assets/video/v1.mp4',
    },
    {
      title: 'Scene 2',
      duration: 5,
      url: '../../../assets/video/v2.mp4',
    },
    {
      title: 'Scene 3',
      duration: 5,
      url: '../../../assets/video/v3.mp4',
    },
  ];
}
