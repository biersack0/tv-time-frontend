import { Component } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [],
})
export class NavbarComponent {
	constructor(private router: Router) {
		this.router.events.subscribe((event: Event) => {
			// Subscribe to event routeChange
			if (event instanceof NavigationStart) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const navbarCollapse = document.getElementById('navbarCollapse')!;

				if (navbarCollapse.classList.contains('show')) {
					navbarCollapse.classList.remove('show');
				}
			}
		});
	}
}
