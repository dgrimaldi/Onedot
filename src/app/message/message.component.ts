import { Component, OnInit } from '@angular/core';
import {MessagesService} from '../messages.service/messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(public service: MessagesService) { }

  ngOnInit() {
  }

}
