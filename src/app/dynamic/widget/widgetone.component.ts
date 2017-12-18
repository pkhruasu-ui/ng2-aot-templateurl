import { Component } from '@angular/core';
import { CustomComponent } from './decorators';
import { ApiService } from '../../api.service';

const met = {
	selector: 'widget-one',
	templateUrl: `./widgetone.component.html`,
	providers: [ApiService]
}
@Component(met)
@CustomComponent(met)
export class WidgetOneComponent {
	constructor(){

	}	
}