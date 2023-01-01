export interface Channel {
	_id: string;
	name: string;
	tag: string;
	ifr: string[];
	image: string;
	category: Category;
	schedules: Schedule[];
}

export enum Category {
	Deportes = 'deportes',
	Documentales = 'documentales',
	Infantiles = 'infantiles',
	Música = 'música',
	Noticias = 'noticias',
	Películas = 'películas',
	Variedades = 'variedades',
}

export interface Schedule {
	start: string;
	end: string;
	title: string;
}
