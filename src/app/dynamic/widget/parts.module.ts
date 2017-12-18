import { NgModule, Component } from '@angular/core';
import { WidgetOneComponent } from './widgetone.component';

import { CustomNgModule, CustomComponent } from './decorators';

const met = {
	declarations: [
		WidgetOneComponent
	],
	imports:[],
	exports: [
		WidgetOneComponent
	],
	entryComponents:[WidgetOneComponent],
	providers: [
	]
};

@NgModule(met)
@CustomNgModule(met)
export class PartsModule {}