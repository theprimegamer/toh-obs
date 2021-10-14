import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' },
    ];

    const locations = [
      { id: 1001, heroId: 11, name: 'Richmond' },
      { id: 1002, heroId: 12, name: 'Charlotte' },
      { id: 1003, heroId: 13, name: 'DC' },
      { id: 1004, heroId: 14, name: 'Philadelphia' },
      { id: 1005, heroId: 15, name: 'Atlanta' },
      { id: 1006, heroId: 16, name: 'Chicago' },
      { id: 1007, heroId: 17, name: 'Denver' },
      { id: 1008, heroId: 18, name: 'Columbus' },
      { id: 1009, heroId: 19, name: 'San Jose' },
      { id: 1010, heroId: 20, name: 'Seattle' },
    ];

    return { heroes, locations };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0
      ? Math.max(...heroes.map((hero) => hero.id)) + 1
      : 11;
  }
}
