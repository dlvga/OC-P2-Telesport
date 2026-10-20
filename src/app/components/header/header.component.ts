import { Component, Input } from '@angular/core';
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgFor],
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() title = '';
  @Input() indicators: { label: string; value: number | string }[] = [];
}
