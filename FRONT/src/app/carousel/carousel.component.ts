import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true, // Composant autonome
  imports: [CommonModule] // Importez CommonModule ici
})
export class CarouselComponent {
  images: string[] = [
    'IMAGE/image1.PNG',
    'IMAGE/image2.PNG'
  ];
  currentIndex: number = 0;
  interval: any;

  ngOnInit() {
    this.startCarousel();
  }

  startCarousel() {
    this.interval = setTimeout(() => {
      this.nextImage();
      this.interval = setInterval(() => {
        this.nextImage();
      }, 5000);
    }, 2000);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
