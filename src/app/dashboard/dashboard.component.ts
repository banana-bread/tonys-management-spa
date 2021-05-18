import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppStateService } from '../services/app-state.service';
import { CompanyService } from '../models/company/company.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  isExpanded = false;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // TODO: move company getting into login spot.
  constructor(
    private breakpointObserver: BreakpointObserver,
    private appState: AppStateService,
    private companyService: CompanyService,
  ) {}

  async ngOnInit(): Promise<void>
  {
    this.appState.setCompany(
      await this.companyService.get('7662f5f0-81a2-442d-9e67-facc712e95ff')
    )
  }
}