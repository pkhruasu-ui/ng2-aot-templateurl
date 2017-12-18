import { Component, NgModule, ChangeDetectionStrategy, Injectable } from '@angular/core';


// export const defaultComponentProps = {
//   selector: undefined,
//   inputs: undefined,
//   outputs: undefined,
//   host: undefined,
//   exportAs: undefined,
//   moduleId: undefined,
//   providers: undefined,
//   viewProviders: undefined,
//   changeDetection: ChangeDetectionStrategy.Default,
//   queries: undefined,
//   templateUrl: undefined,
//   template: undefined,
//   styleUrls: undefined,
//   styles: undefined,
//   animations: undefined,
//   encapsulation: undefined,
//   interpolation: undefined,
//   entryComponents: undefined
// };

// const Reflect = global['Reflect'];

// const c = class c {};
// CustomComponentFAC({})(c);
// const DecoratorFactory = Object.getPrototypeOf(Reflect.getOwnMetadata('annotations', c)[0]);

// export function CustomComponent(_props) {
//   let props = Object.create(DecoratorFactory);
//   props = Object.assign(props, defaultComponentProps, _props);

//   return function (cls) {
//     Reflect.defineMetadata('annotations', [props], cls);
//   }
// }

export function CustomComponent(annotation: any) {
  return function (target: Function) {
    //var parentTarget = annotation.parent;
    let metaData = new Component(annotation)
    Component(metaData)(target)
  }
}

export function CustomNgModule(annotation: any) {
  return function (target: Function) {
    //var parentTarget = annotation.parent;
    let metaData = new NgModule(annotation)
    NgModule(metaData)(target)
  }
}

export function CustomInjectable() {
    return function (target: Function) {
        //var parentTarget = annotation.parent;
        Injectable()(target)
    }
}