import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { PracticeExerciseComponent } from './practice-exercise/practice-exercise.component';
import { PracticeTestComponent } from './practice-test/practice-test.component';
import { StudyMaterialComponent } from './study-material/study-material.component';
import { TestSeriesComponent } from './test-series/test-series.component';
import { WatchLearnComponent } from './watch-learn/watch-learn.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'profile',
    component: MyProfileComponent,
  },
  {
    path: 'practice-exercise',
    component: PracticeExerciseComponent,
  },
  {
    path: 'practice-test',
    component: PracticeTestComponent,
  },
  {
    path: 'test-series',
    component: TestSeriesComponent,
  },
  {
    path: 'study-material',
    component: StudyMaterialComponent,
  },
  {
    path: 'watch-and-learn',
    component: WatchLearnComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
