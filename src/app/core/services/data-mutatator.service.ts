import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataMutatatorService {

  constructor() { }

  private convertToLowerCase(obj: any): any {
    if (typeof obj === 'string') {
      return obj.toLowerCase();
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertToLowerCase(item));
    }
    if (typeof obj === 'object') {
      const convertedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          convertedObj[key] = this.convertToLowerCase(obj[key]);
        }
      }
      return convertedObj;
    }
    return obj;
  }

  private capitalizeString(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private convertToTitleCase(obj: any): any {
    if (typeof obj === 'string') {
      return this.capitalizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertToTitleCase(item));
    }
    if (typeof obj === 'object') {
      const convertedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          convertedObj[key] = this.convertToTitleCase(obj[key]);
        }
      }
      return convertedObj;
    }
    return obj;
  }

  public convertDataToTitleCase(data: any): any {
    return this.convertToTitleCase(data);
  }

  public convertDataToLowerCase(data: any): any {
    return this.convertToLowerCase(data);
  }

}
