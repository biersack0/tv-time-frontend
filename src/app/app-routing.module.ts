import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChannelDetailComponent } from './pages/channel-detail/channel-detail.component';
import { LegalDisclaimerComponent } from './pages/legal-disclaimer/legal-disclaimer.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'canal/:tag',
		component: ChannelDetailComponent,
	},
	{
		path: 'descargo-legal',
		component: LegalDisclaimerComponent,
	},
	{
		path: '**',
		redirectTo: '',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
