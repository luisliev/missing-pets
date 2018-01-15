import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPetPage } from './add-pet';

@NgModule({
  declarations: [
    AddPetPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPetPage),
  ],
})
export class AddPetPageModule {}
