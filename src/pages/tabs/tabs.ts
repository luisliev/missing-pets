import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { ListPage } from '../list/list';
import { AddPetPage } from '../add-pet/add-pet';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root:any = HomePage;
  tab2Root:any = ListPage;
  tab3Root:any = AddPetPage;
  tab4Root:any = ContactPage;
  myIndex: number;
  valueforngif=true;

  constructor(navParams: NavParams) {
    this.myIndex = navParams.data.tabIndex || 0;  
  }
}
