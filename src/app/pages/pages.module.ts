import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LegalDisclaimerComponent } from './legal-disclaimer/legal-disclaimer.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		HomeComponent,
		LegalDisclaimerComponent,
		ChannelDetailComponent,
	],
	imports: [CommonModule, RouterModule, SharedModule, FormsModule],
})
export class PagesModule {}
