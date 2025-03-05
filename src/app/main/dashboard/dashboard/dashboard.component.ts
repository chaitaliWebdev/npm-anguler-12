import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboardData: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private httpRequestService: HttpRequestService,

    private router: Router
  ) {}

  ngOnInit(): void {
    // this.getDasboardData();
  }

  /* Get  dashboard details */
  getDasboardData(): void {
    this.httpRequestService.request('get', `site-settings/dashboard`).subscribe(
      (result: any) => {
        console.log(result);
        this.dashboardData = result.data;
      },
      (error: any) => {}
    );
  }
}
