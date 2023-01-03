import { ChannelService } from '@app/services/channel.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Channel, Schedule } from '@app/interfaces/channel.interface';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable, timer } from 'rxjs';
import { Utils } from '@app/shared/utils/utils';
@Component({
	selector: 'app-channel-detail',
	templateUrl: './channel-detail.component.html',
	styleUrls: ['./channel-detail.component.scss'],
})
export class ChannelDetailComponent implements OnInit {
	channels: Channel[] = [];
	channel: Channel | undefined;
	hour: Observable<string> | undefined;
	currentProgram: Schedule[] | undefined;
	disablePrevButton = false;
	disableNextButton = false;
	currentIndexInChannels = 0;
	categories: Category[] = [];
	categoryActived = 'all';
	iframe = '';
	isLoading = true;
	hasError = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private channelService: ChannelService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.hour = timer(0, 1000).pipe(
			map(() => moment().format('H:mm')),
			distinctUntilChanged()
		);

		// Verified if exists channels in sessionStorage
		if (sessionStorage.getItem('ch')) {
			this.channels = new Utils().loadFromSessionStorage();
			this.getCategories(this.channels);
			this.getChannelFromUrl();
		} else {
			this.getChannels();
		}

		this.verifyIfExistsCategoryInStorage();
	}

	getChannelFromUrl() {
		this.activatedRoute.params
			.pipe(switchMap(({ tag }) => this.channelService.getChannel(tag)))
			.subscribe({
				next: (channel) => {
					this.channel = channel;
					this.getCurrentProgram(channel);
					this.getCurrentIndexInChannels(channel);
					this.decodeIframe(channel);
				},
				error: () => (this.hasError = true),
			});
	}

	verifyIfExistsCategoryInStorage() {
		if (sessionStorage.getItem('category')) {
			const category = sessionStorage.getItem('category') || '';
			this.filterByCategory(category);
		}
	}

	getChannels() {
		this.channelService.getAllChannel().subscribe({
			next: (channels) => {
				this.channels = channels;
				new Utils().saveToSessionStorage(channels);
				this.getCategories(this.channels);
				this.getChannelFromUrl();
			},
		});
	}

	getCurrentProgram(res: Channel) {
		if (res.schedules.length > 0) {
			this.hour?.subscribe({
				next: (hour) => {
					const current = moment(hour, 'h:mm A');

					const currentProgram = res.schedules.filter((schedule) => {
						const beginningTime = moment(schedule.start, 'h:mm A');
						const endTime = moment(schedule.end, 'h:mm A');

						return current.isAfter(beginningTime) && current.isBefore(endTime);
					});

					this.currentProgram = currentProgram;
				},
			});
		}

		this.currentProgram = undefined;
	}

	decodeIframe(channel: Channel) {
		const iframes = channel.ifr.map((url) => {
			return decodeURIComponent(url).replace(/!&/g, 'a');
		});

		this.iframe = iframes[0];
	}

	getCurrentIndexInChannels(channel: Channel) {
		const currentIndexInChannels = this.channels.findIndex(
			(ch) => channel._id == ch._id
		);

		//Disable buttons Prev and Next
		currentIndexInChannels === 0
			? (this.disablePrevButton = true)
			: (this.disablePrevButton = false);

		currentIndexInChannels === this.channels.length - 1
			? (this.disableNextButton = true)
			: (this.disableNextButton = false);

		this.currentIndexInChannels = currentIndexInChannels;
	}

	goPrevChannel() {
		this.currentProgram = [];
		if (this.disablePrevButton) return;

		const prevChannel = this.channels[this.currentIndexInChannels - 1];
		this.router.navigate(['/canal', prevChannel.tag]);
	}

	goHomeChannel() {
		this.router.navigate(['/']);
	}

	goNextChannel() {
		this.currentProgram = [];
		if (this.disableNextButton) return;

		const nextChannel = this.channels[this.currentIndexInChannels + 1];
		this.router.navigate(['/canal', nextChannel.tag]);
	}

	getCategories(channels: Channel[]) {
		const categories = channels.map((channel) => channel.category);
		const uniqueCategories = [...new Set(categories)];

		this.categories = uniqueCategories;
	}

	filterByCategory(category: string) {
		const channels = new Utils().loadFromSessionStorage();
		if (category === 'all') {
			this.channels = channels;
			this.categoryActived = 'all';
			this.router.navigate(['/canal', channels[0].tag]);
			return;
		}

		this.categoryActived = category;

		const channelsFiltered = channels.filter((channel) => {
			return channel.category == category;
		});

		this.channels = channelsFiltered;
		this.router.navigate(['/canal', channelsFiltered[0].tag]);
	}

	hideLoading(): void {
		setTimeout(() => {
			this.isLoading = false;
		}, 3000);
	}
}
