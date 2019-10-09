import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DictionaryListComponent } from './dictionary.list/dictionary.list.component';
import en from '@angular/common/locales/en';
import { ModalAddComponent } from './modal.add.value/modal.add.value.component';
import {NgZorroAntdModule, NZ_I18N, en_GB} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {registerLocaleData} from '@angular/common';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {HttpClientModule} from '@angular/common/http';
import { MessageComponent } from './message/message.component';

registerLocaleData(en);

const appRoutes: Routes = [
  {path: 'dictionary-list', component: DictionaryListComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    DictionaryListComponent,
    ModalAddComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    AppRoutingModule,
    MatDialogModule,
    RouterModule.forRoot(
      appRoutes
    ),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    NzIconModule,
    HttpClientModule

  ],
  providers: [{ provide: NZ_I18N, useValue: en_GB }],
  bootstrap: [AppComponent]
})
export class AppModule { }


