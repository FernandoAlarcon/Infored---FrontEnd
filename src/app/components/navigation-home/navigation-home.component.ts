import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-home',
  templateUrl: './navigation-home.component.html',
  styleUrls: ['./navigation-home.component.css',
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
export class NavigationHomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
