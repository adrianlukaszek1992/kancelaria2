import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PersonalDataComponent} from './personal-data/personal-data.component';
import {RegisterIndustralDesignComponent} from './registerIndustralDesign/registerIndustralDesign.component';

const routes: Routes = [
  { path: 'personal-data', component: PersonalDataComponent},
  {path: '',  component: RegisterIndustralDesignComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
