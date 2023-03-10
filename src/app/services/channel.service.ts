import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Channel } from '@app/interfaces/channel.interface';

@Injectable({
	providedIn: 'root',
})
export class ChannelService {
	// private apiUrl = 'http://localhost:3005/api';
	private apiUrl: string;

	constructor(private httpClient: HttpClient) {
		this.apiUrl = environment.apiUrl;
	}

	getAllChannel() {
		return this.httpClient.get<Channel[]>(`${this.apiUrl}/channel`);
	}

	getChannel(tag: string) {
		return this.httpClient.get<Channel>(`${this.apiUrl}/channel/${tag}`);
	}
}
