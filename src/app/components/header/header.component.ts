import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Indicator } from '../../models/indicator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgFor, NgIf],
  standalone: true,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() title = '';
  @Input() indicators: Indicator[] = [];
}
