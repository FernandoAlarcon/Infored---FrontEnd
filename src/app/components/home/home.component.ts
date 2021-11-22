import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss', 
               '../../../assets/landing/css/theme.css', 
               '../../../assets/landing/css/theme-elements.css',
               '../../../assets/landing/css/theme-blog.css',
               '../../../assets/landing/css/theme-shop.css',
               '../../../assets/landing/vendor/rs-plugin/css/settings.css',
               '../../../assets/landing/vendor/rs-plugin/css/layers.css',
               '../../../assets/landing/vendor/rs-plugin/css/navigation.css',
               '../../../assets/landing/css/skins/default.css',
               '../../../assets/landing/css/custom.css'
              ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}