import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CustomInjectable } from './dynamic/widget/decorators';

@Injectable()
@CustomInjectable()
export class ApiService {
	// constructor(public http:HttpClient){}
	constructor(public http:Injectable){}
}