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
    const words = str.split(/\W+/);
  
    // Capitalize the first letter of each word using map
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  private convertToTitleCase(obj: any): any {
    const wordsExceptions = ['correoElectronico', 'grado', 'userId', 'id', 'fechaCreacion', 'fechaActualizacion', 'eliminado']

    if (typeof obj === 'string') {
      return this.capitalizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertToTitleCase(item));
    }
    if (typeof obj === 'object') {
      const convertedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && !wordsExceptions.includes(key)) {
          convertedObj[key] = this.convertToTitleCase(obj[key]);
        } else {
          convertedObj[key] = obj[key];
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
