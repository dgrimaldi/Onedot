import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {DictionaryListComponent} from './dictionary.list/dictionary.list.component';
import {ModalAddComponent} from './modal.add.value/modal.add.value.component';

// Redirect to DictionaryListComponent if the URL contain ''
const routes: Routes = [
  {
    path: 'dictionary-list', component: DictionaryListComponent,

    // Declaration of the dummy component and
    // configure the Router Module to load it
    // on ‘dialog’ navigation
    children: [{
      path: 'add-value',
      component: ModalAddComponent
    }]
  },

  // pathMatch: 'full' result in a route hit when
  // the remaining, unmatched segments of the URL match
  // ''.
  {path: '', redirectTo: '/dictionary-list', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
