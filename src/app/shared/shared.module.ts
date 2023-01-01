import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SafePipe } from './pipes/safe.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [NavbarComponent, FooterComponent, SafePipe],
	imports: [CommonModule, RouterModule, FormsModule],
	exports: [NavbarComponent, FooterComponent, SafePipe],
})
export class SharedModule {}
