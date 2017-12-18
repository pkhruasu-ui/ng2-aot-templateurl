import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LazyGuestComponent } from './lazyguest.component';

const lazyGuestRoutes: Routes = [
{
  path: '', component: LazyGuestComponent 
}];

@NgModule({
	declarations: [
		LazyGuestComponent
	],
	imports: [
		CommonModule,		
		RouterModule.forChild(lazyGuestRoutes)
	],
	exports: [
		RouterModule
	],
	providers: []
})
export class LazyGuestModule { }