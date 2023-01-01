import { Component } from '@angular/core';
import { Category, Channel } from '@app/interfaces/channel.interface';
import { ChannelService } from '@app/services/channel.service';
import { Utils } from '@app/shared/utils/utils';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	channels: Channel[] = [];
	categories: Category[] = [];
	categoryActived = 'all';
	searchBox = '';
	termToSearch = new Subject<string>();

	constructor(private channelService: ChannelService) {
		//remove category if exists in storage
		if (sessionStorage.getItem('category')) {
			sessionStorage.removeItem('category');
		}

		//Subscrite to input
		this.termToSearch.subscribe((term) => {
			this.filterBySearch(term);
			//remove category if exists in storage
			if (sessionStorage.getItem('category')) {
				sessionStorage.removeItem('category');
			}
		});

		// Verified if exists in storage channels
		if (sessionStorage.getItem('ch')) {
			this.channels = new Utils().loadFromSessionStorage();
			this.getCategories(this.channels);
		} else {
			this.getChannels();
		}
	}

	getChannels() {
		this.channelService.getAllChannel().subscribe({
			next: (channels) => {
				new Utils().saveToSessionStorage(channels);
				this.channels = channels;
				this.getCategories(this.channels);
			},
		});
	}

	getCategories(channels: Channel[]) {
		const categories = channels.map((channel) => channel.category);
		const uniqueCategories = [...new Set(categories)];

		this.categories = uniqueCategories;
	}

	filterByCategory(category: string) {
		this.searchBox = '';
		sessionStorage.setItem('category', category);

		const channels = new Utils().loadFromSessionStorage();
		if (category === 'all') {
			this.channels = channels;
			this.categoryActived = 'all';
			return;
		}

		this.categoryActived = category;

		const channelsFiltered = channels.filter((channel) => {
			return channel.category == category;
		});

		this.channels = channelsFiltered;
	}

	filterBySearch(term: string) {
		this.categoryActived = 'all';

		const channels = new Utils().loadFromSessionStorage();
		const channelsFiltered = channels.filter((channel) => {
			return channel.name.toLowerCase().includes(term.toLowerCase());
		});

		this.channels = channelsFiltered;
	}
}
