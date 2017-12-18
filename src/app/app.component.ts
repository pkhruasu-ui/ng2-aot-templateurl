import { Component, OnInit, Compiler, Inject} from '@angular/core';
/*import { ComponentFactory, ViewChild, ViewContainerRef} from '@angular/core';*/

// import { DynamicTypeBuilder, IHaveDynamicData} from './dynamic/dynamic.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{ 

	public something = true;

	// private componentRef:any;
	// @ViewChild('dataContainer', { read: ViewContainerRef }) dataContainer: ViewContainerRef;

	// @ViewChild('dataContainer2', { read: ViewContainerRef }) dataContainer2: ViewContainerRef;

	// compiler:any;
	constructor(
		// protected typeBuilder: DynamicTypeBuilder,
		// @Inject(Compiler) compiler:Compiler
	){
		// this.compiler = compiler;
	}

	public componentName = "My app Component"

	ngOnInit(){
		// this.typeBuilder.createComponentFactory('<div>I am dynamic content</div>', this.compiler).then(
  //           (data: ComponentFactory<IHaveDynamicData>)  => {
  //               this.dataContainer.clear();
  //               this.componentRef = this.dataContainer.createComponent(data);
  //           });

		// this.typeBuilder.createComponentFactory('<div *ngIf="something">I might dynamic content</div>', this.compiler).then(
  //           (data: ComponentFactory<IHaveDynamicData>)  => {
  //               this.dataContainer2.clear();
  //               this.componentRef = this.dataContainer2.createComponent(data);
  //           });
	}
}