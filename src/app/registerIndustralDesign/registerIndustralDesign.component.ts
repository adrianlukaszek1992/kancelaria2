import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {NgForm} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppService} from '../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'register-tradeMark',
  templateUrl: './registerIndustralDesign.component.html',
  styleUrls: ['./registerIndustralDesign.component.scss']
})
export class RegisterIndustralDesignComponent {
  analysisTypes = ['Podstawowa', 'Premium'];
  defaultImage :string;
  analysisTypeRegistred: string;
  myFiles: string [] = [];
  priceConfig: any[];
  selectedUrl: any;
  selectedImage: any;
  images = [];
  urlToImageMap = {};
  price: string;
  jsonURL = 'assets/priceConfig.json';
  filesPath: string;
  // sumUpText: string = 'Ochrona obejmie następujące towary: ';
  // sumUpObjects: string[] = [];
  sumUpTransferObjects: string[] = [];
  selectedProduct: any;
  selectedClass: any;
  selectedBaseNumber: any;
  areaRegistered: string;
  noProductsSelected: boolean = true;
  areas: string[] = ['Polska', 'UE'];
  public displayedColumns = ['classNumber', 'products', 'add'];
  public dataSource = new MatTableDataSource<any[]>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public userArray: any[] = [];


  constructor(private http: HttpClient, private router: Router) {
    this.http.get('./assets/data.csv', {responseType: 'text'})
      .subscribe(
        data => {
          const csvToRowArray = data.split('\n');
          this.userArray = csvToRowArray.map(element => {
            const row = element.split(',');
            return {
              'classNumber': row[0],
              'baseNumber': row[1],
              'products': row[2]
            };
          });

          this.dataSource = new MatTableDataSource(this.userArray);
          this.paginator.pageSize = 10;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.userArray);
        },
        error => {
          console.log(error);
        }
      );
    this.getJSON().subscribe(data => {
      this.priceConfig = data;
      console.log(data);
      console.log(this.priceConfig);
    });
  }

  handleNext() {
    if(!this.selectedImage || !this.analysisTypeRegistred || !this.selectedProduct  ||!this.areaRegistered || !this.filesPath){
      window.alert('Uzupełnij wszystkie pola');
      return;
    }
    AppService.setSelectedImage(this.selectedImage);
    AppService.setAnalysisType(this.analysisTypeRegistred);
    AppService.setProducts(this.parseTransferObjectToString());
    AppService.setAreaRegistered(this.areaRegistered);
    AppService.setFilePath(this.filesPath);
    AppService.setPrice(this.price);
    this.router.navigateByUrl('/personal-data');

  }

  areaChanged(area) {
    this.areaRegistered = area;
    // if (this.selectedClasses.length) {
    //   this.calculatePrice();
    // }
  }

  analysisTypeChanged(analysisType){
    this.analysisTypeRegistred = analysisType;
    if(analysisType ==='Podstawowa'){
      this.price='35';
      return;
    }
    this.price='85';
  }

  calculatePrice() {

    // if (this.areaRegistered === 'Polska') {
    //   this.price = (850 + this.selectedClasses.reduce((acc: number, val: string) => {
    //     acc = acc + Number(this.priceConfig['Poland'][val]);
    //     return acc;
    //   }, 0)).toString() + '€';
    //   return;
    // }
    // this.price = (850 + this.selectedClasses.reduce((acc: number, val: string) => {
    //   acc = acc + Number(this.priceConfig['EU'][val]);
    //   return acc;
    // }, 0)).toString() + '€';
  }

  parseTransferObjectToString() {
    return this.selectedProduct+ '-' + this.selectedBaseNumber+ '-' + this.selectedClass;
  }

  handleImageClick(url) {
    this.selectedImage = this.urlToImageMap[url];
    this.selectedUrl = url;
  }


  fileEvent(e, f: NgForm) {
    let isWrongFormat = false;
    console.log(e.target.files);
    for (let file in e.target.files) {
      if (!isNaN(Number(file)) && !this.isFileExtensionCorrect(e.target.files[file]['name'])) {
        window.alert('Akceptujemy tylko pliki o rozszerzeniach .jpg, .png, .gif, .tif, .tiff, .eps');
        isWrongFormat = true;
        return;
      }
    }
    if (isWrongFormat) {
      return;
    }

    for (let i = 0; i < e.target.files.length; i++) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        const result = event.target.result;
        this.images.push(result);
        this.urlToImageMap[result] = e.target.files[i]['name'];
      };
      reader.readAsDataURL(e.target.files[i]);
      this.myFiles.push(e.target.files[i]);
    }
    this.onSubmitform(f, this.myFiles);

  }

  isFileExtensionCorrect(fileName) {
    return fileName.endsWith('.jpg') || fileName.endsWith('.png')
      || fileName.endsWith('.gif') || fileName.endsWith('.tif')
      || fileName.endsWith('.tiff') || fileName.endsWith('.eps');
  }


  /* Upload button functioanlity */
  onSubmitform(f: NgForm, files: any[]) {

    let myFormData = new FormData();

    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //myFormData.append('filesPath', (Date.now()).toString());
    //myFormData.append('uploadFile', this.filedata);
    for (let i = 0; i < files.length; i++) {
      myFormData.append('file[]', files[i]);
    }

    /* Image Post Request */
    this.http.post('https://sarey.pl/dev/rajan/tools/saveTest.php', myFormData).subscribe(data => {
      this.filesPath = data['data'];
      console.log(this.filesPath)
    });

  }

  public getJSON(): Observable<any> {
    return this.http.get(this.jsonURL);
  }


  handleClick(element) {
    console.log(element);
  }

  public customSort = (event) => {
    console.log(event);
  };

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  handleAdd(product, classNumber, baseNumber) {
    if (!this.areaRegistered) {
      window.alert('Wybierz proszę najpierw gdzie chcesz zarejestrować znak towarowy');
      return;
    }
    this.noProductsSelected = false;
    this.selectedProduct = product;
    this.selectedClass = classNumber;
    this.selectedBaseNumber = baseNumber;
    //this.calculatePrice();
  }

}
