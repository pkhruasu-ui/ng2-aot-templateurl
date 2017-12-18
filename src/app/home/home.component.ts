import { Component, OnInit } from '@angular/core';

import { ComponentFactory, ViewChild, ViewContainerRef, Compiler, Inject} from '@angular/core';
import { DynamicTypeBuilder, IHaveDynamicData} from '../dynamic/dynamic.service';

@Component({
	selector: 'home-comp',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
	public componentName:string;

	private componentRef:any;
	@ViewChild('dataContainer', { read: ViewContainerRef }) dataContainer: ViewContainerRef;

	@ViewChild('dataContainer2', { read: ViewContainerRef }) dataContainer2: ViewContainerRef;

	compiler:any;

	constructor(
		protected typeBuilder: DynamicTypeBuilder,
		@Inject(Compiler) compiler:Compiler
		){
			this.compiler = compiler;
	}

	ngOnInit(){
		this.componentName = "Home Component";

		this.typeBuilder.createComponentFactory(' <i>first</i> <widget-one></widget-one><div>I am dynamic content 1</div>', this.compiler).then(
            (data: ComponentFactory<IHaveDynamicData>)  => {
                this.dataContainer.clear();
                this.componentRef = this.dataContainer.createComponent(data);
            });

		this.typeBuilder.createComponentFactory('<i>Second</i><div *ngIf="something">I might dynamic content 2</div><widget-one></widget-one>', this.compiler).then(
            (data: ComponentFactory<IHaveDynamicData>)  => {
                this.dataContainer2.clear();
                this.componentRef = this.dataContainer2.createComponent(data);
            });
	}
}