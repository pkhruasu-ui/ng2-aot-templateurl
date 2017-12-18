import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'lazy-guest',
	templateUrl: './lazyguest.component.html'
})
export class LazyGuestComponent implements OnInit {
	public componentName:string;

	constructor(){}

	ngOnInit(){		
		this.componentName = "Lazy Guest Component";
	}
}