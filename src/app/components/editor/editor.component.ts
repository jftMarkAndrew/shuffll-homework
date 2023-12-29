import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SceneComponent } from '../scene/scene.component';
import { PreviewComponent } from '../preview/preview.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
export class EditorComponent {}
