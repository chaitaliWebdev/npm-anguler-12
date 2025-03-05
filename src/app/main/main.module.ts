import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { PracticeExerciseComponent } from './practice-exercise/practice-exercise.component';
import { PracticeTestComponent } from './practice-test/practice-test.component';
import { TestSeriesComponent } from './test-series/test-series.component';
import { WatchLearnComponent } from './watch-learn/watch-learn.component';
import { StudyMaterialComponent } from './study-material/study-material.component';



@NgModule({
  declarations: [
  MyProfileComponent,
  PracticeExerciseComponent,
  PracticeTestComponent,
  TestSeriesComponent,
  WatchLearnComponent,
  StudyMaterialComponent,
  ],
  imports: [CommonModule, MainRoutingModule, SharedModule],
})
export class MainModule {}
