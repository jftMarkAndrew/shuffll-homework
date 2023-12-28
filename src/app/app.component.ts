import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, EditorComponent],
})
export class AppComponent {
  title = 'shuffll-homework';
}
