import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent {
  isPlaying = false;

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }
}
