import { Routes } from '@angular/router';
import { NoticeList } from './components/notice-list/notice-list';
import { NoticeEditor } from './components/notice-editor/notice-editor';
import { NoticeComparison } from './components/notice-comparison/notice-comparison';

export const routes: Routes = [
  { path: '', component: NoticeList },
  { path: 'editor', component: NoticeEditor },
  { path: 'compare/:id1/:id2', component: NoticeComparison },
  { path: '**', redirectTo: '' }
];
