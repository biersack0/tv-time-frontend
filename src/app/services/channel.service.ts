import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Channel } from '@app/interfaces/channel.interface';

@Injectable({
	providedIn: 'root',
})
export class ChannelService {
	// private apiUrl = 'http://localhost:3000/api';
	private apiUrl = 'https://tv-time-api.dev.alexbsk.com/api';

	constructor(private httpClient: HttpClient) {}

	getAllChannel() {
		return this.httpClient.get<Channel[]>(`${this.apiUrl}/channel`);
	}

	getChannel(tag: string) {
		return this.httpClient.get<Channel>(`${this.apiUrl}/channel/${tag}`);
	}
}
