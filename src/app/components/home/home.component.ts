import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home-dialog.component.html',
  styleUrls: [ './home.component.scss', 
               './landing/css/theme.css', 
               './landing/css/theme-elements.css',
               './landing/css/theme-blog.css',
               './landing/css/theme-shop.css',
               './landing/vendor/rs-plugin/css/settings.css',
               './landing/vendor/rs-plugin/css/layers.css',
               './landing/vendor/rs-plugin/css/navigation.css',
               './landing/css/skins/default.css',
               './landing/css/custom.css'
              ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}