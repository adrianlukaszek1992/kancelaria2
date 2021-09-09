import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  static getSelectedImage() {
    return this._selectedImage;
  }

  static setSelectedImage(value: string) {
    this._selectedImage = value;
  }
  static getPrice(): string {
    return this._price;
  }

  static setPrice(value: string) {
    this._price = value;
  }

  static getFilePath(): string {
    return this._filePath;
  }

  static setFilePath(value: string) {
    this._filePath = value;
  }

  static getAreaRegistered(): string {
    return this._areaRegistered;
  }

  static setAreaRegistered(value: string) {
    this._areaRegistered = value;
  }

  static getProducts(): string {
    return this._products;
  }

  static setProducts(value: string) {
    this._products = value;
  }
  static getAnalysisType(){
    return this._analysisType;
  }

  static setAnalysisType(value: string) {
    this._analysisType = value;
  }


  private static _price:string;
  private static _analysisType:string;
  private static _selectedImage:string;
  private static _filePath:string;
  private static _areaRegistered:string;
  private static _products:string;
  constructor() { }

}
