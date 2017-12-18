import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { HomeModule } from './home/home.module';
import { LazyGuestModule } from './lazyguest/lazyguest.module';

import '../style/app.scss';
import '../style/other.css';

import { DynamicModule } from './dynamic/dynamic.module';

const appRoutes: Routes = [ 
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: "lazy",
    loadChildren: './lazyguest/lazyguest.module#LazyGuestModule'
  }  
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)// <-- debugging purposes only
    
  ],
  providers: [    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }