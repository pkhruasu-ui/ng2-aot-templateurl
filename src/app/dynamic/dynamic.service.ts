/**
 * Created by pkhruasuwan on 12/12/16.
 */
import { Component, ComponentFactory, NgModule, Input, Injectable,NO_ERRORS_SCHEMA} from '@angular/core';
import { Compiler, COMPILER_OPTIONS, CompilerFactory } from '@angular/core';

import { CommonModule }                         from "@angular/common";
import { FormsModule }                          from '@angular/forms';
import { RouterModule }                         from '@angular/router';
import { PartsModule }							from './widget/parts.module';

import {JitCompilerFactory} from '@angular/platform-browser-dynamic';
import { WidgetOneComponent } from './widget/widgetone.component';

import { CustomComponent, CustomNgModule } from './widget/decorators';

export interface IHaveDynamicData {
	something?: true;
    entity: any;
}

@Injectable()
export class DynamicTypeBuilder {

    // wee need Dynamic component builder
    constructor(
        protected compiler: Compiler
    ) {}

    // this object is singleton - so we can use this as a cache
    private _cacheOfFactories: {[templateKey: string]: ComponentFactory<IHaveDynamicData>} = {};

    public createComponentFactory(template: string, compiler:any): Promise<ComponentFactory<IHaveDynamicData>> {

        let factory = this._cacheOfFactories[template];

        if (factory) {
            console.log("Module and Type are returned from cache")

            return new Promise((resolve) => {
                resolve(factory);
            });
        }

        // unknown template ... let's create a Type for it
        let type   = this.createNewComponent(template);
        let module = this.createComponentModule(type);

        return new Promise((resolve) => {
            compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) =>
                {
                    let factory = moduleWithFactories.componentFactories.find(factory => {
                        return factory.componentType == type ;
                    })
                    // factory = _.find(moduleWithFactories.componentFactories, { componentType: type });

                    this._cacheOfFactories[template] = factory;

                    // resolve(factory);
                    resolve(factory);
                });
        });
    }

    protected createNewComponent (tmpl:string) {
        @CustomComponent({
            selector: 'dynamic-component',
            template: tmpl
        })
        class CustomDynamicComponent  implements IHaveDynamicData {
            @Input()  public entity: any;
        };
        // a component for this particular template
        return CustomDynamicComponent;
    }
    protected createComponentModule (componentType: any) {

    	const metadata = {
    		declarations: [
                componentType,
                WidgetOneComponent
            ],
			imports: [
                CommonModule,
                FormsModule
            ],
			exports:  [
                componentType
            ],
            entryComponents:[WidgetOneComponent],
			providers: []
    	}

        @NgModule(metadata)
        @CustomNgModule(metadata)
        class RuntimeComponentModule
        {
        }
        // a module for just this Type
        return RuntimeComponentModule;
    }
}


