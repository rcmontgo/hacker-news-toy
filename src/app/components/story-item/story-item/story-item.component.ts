import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-story-item',
  templateUrl: './story-item.component.html',
  styleUrls: ['./story-item.component.css']
})
export class StoryItemComponent implements OnInit {
  @Input() story;
  @Input() i;
  @Input() start;
  constructor() { }

  ngOnInit(): void {
  }

}
