import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent, IBreadCrumb } from '@gosi-ui/core';
import { Router, ActivatedRoute, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'gosi-breadcrumb-dc',
  templateUrl: './breadcrumb-dc.component.html',
  styleUrls: ['./breadcrumb-dc.component.scss']
})
export class BreadcrumbDcComponent extends BaseComponent implements OnInit {
  /**
   * input variables
   */
  @Input() noMargin: false;
  @Input() noSpacing: false;

  /**Local Variables */
  public breadcrumbs: IBreadCrumb[];
  /**
   * Creates an instance of BreadcrumbDcComponent
   * @memberof  BreadcrumbDcComponent
   *
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    super();
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: RouterEvent) => {
          return event instanceof NavigationEnd;
        }),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      });
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    //If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
