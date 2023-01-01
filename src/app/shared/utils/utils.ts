import { Channel } from '@app/interfaces/channel.interface';

export class Utils {
	saveToSessionStorage(data: Channel[]) {
		sessionStorage.setItem('ch', encodeURIComponent(JSON.stringify(data)));
	}

	loadFromSessionStorage(): Channel[] {
		const channels = sessionStorage.getItem('ch') || '';
		return JSON.parse(decodeURIComponent(channels));
	}
}
