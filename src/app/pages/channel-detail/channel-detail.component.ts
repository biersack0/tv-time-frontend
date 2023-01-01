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
	error = false;
	hour: Observable<string> | undefined;
	currentProgram: Schedule[] | undefined;
	disablePrevButton = false;
	disableNextButton = false;
	currentIndexInChannels = 0;
	categories: Category[] = [];
	categoryActived = 'all';

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

		// Verified if exists in storage channels
		if (sessionStorage.getItem('ch')) {
			this.channels = new Utils().loadFromSessionStorage();
			this.getCategories(this.channels);
		} else {
			this.getChannels();
		}

		this.activatedRoute.params
			.pipe(switchMap(({ tag }) => this.channelService.getChannel(tag)))
			.subscribe({
				next: (res) => {
					this.channel = res;
					this.getCurrentProgram(res);
					this.getCurrentIndexInChannels(res);
				},
				error: () => (this.error = true),
			});

		this.verifyIfExistsCategoryInStorage();
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
				new Utils().saveToSessionStorage(channels);
				this.channels = channels;
				this.getCategories(this.channels);
			},
		});
	}

	getCurrentProgram(res: Channel) {
		if (res.schedules.length > 0) {
			this.hour?.subscribe({
				next: (hour) => {
					const current = moment(hour, 'h:mm');

					const currentProgram = res.schedules.filter((schedule) => {
						const beginningTime = moment(schedule.start, 'h:mm');
						const endTime = moment(schedule.end, 'h:mm');

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

		return iframes[0];
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
		if (this.disablePrevButton) return;

		const prevChannel = this.channels[this.currentIndexInChannels - 1];
		this.router.navigate(['/canal', prevChannel.tag]);
	}

	goHomeChannel() {
		this.router.navigate(['/']);
	}

	goNextChannel() {
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
}
