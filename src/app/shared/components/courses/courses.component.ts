import { Component, Input, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  allCourses: any[] = [];
  @Input() type: any;
  serviceType: any = '';
  constructor(
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit(): void {
    this.getCourseInfo();
  }

  ngOnChanges(...args: any[]): void {
    if (args && args.length) {
      this.serviceType = this.type
      console.log(this.serviceType);
    }
  }

  // get all course 
  getCourseInfo(): void {
    this.httpRequestService
      .request('get', `${this.serviceType}/student/courses`)
      .subscribe((result: any) => {
        this.allCourses = result.data;
        console.log(this.allCourses);
      });
  }

}
