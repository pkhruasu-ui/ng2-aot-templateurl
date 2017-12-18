import { NgModule, Compiler, COMPILER_OPTIONS, CompilerFactory, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTypeBuilder } from './dynamic.service';

import { JitCompilerFactory, ɵResourceLoaderImpl} from '@angular/platform-browser-dynamic';
import { ResourceLoader } from '@angular/compiler';
import { WidgetOneComponent } from './widget/widgetone.component';

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}
import { PartsModule } from './widget/parts.module';

import { CustomComponent, CustomNgModule } from "./widget/decorators";

@NgModule({
	declarations: [],
	entryComponents:[WidgetOneComponent],
	imports: [CommonModule, PartsModule],	
	exports: [
	],
	providers:[
		DynamicTypeBuilder,
		// {provide: ResourceLoader, useValue: ɵResourceLoaderImpl },
		{provide: COMPILER_OPTIONS, useValue: {}, multi: true},
    	{provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
    	{provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory]}    	
	]
})
export class DynamicModule{
	// static forChild()
 //    {
 //        return {
 //            ngModule: DynamicModule,
 //            providers: [ // singletons accross the whole app
 //              DynamicTypeBuilder
 //            ], 
 //        };
 //    }
}