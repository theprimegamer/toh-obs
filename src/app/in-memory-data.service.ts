import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Dr Nice', powerId: 101 },
      { id: 12, name: 'Narco', powerId: 102 },
      { id: 13, name: 'Bombasto', powerId: 103 },
      { id: 14, name: 'Celeritas', powerId: 104 },
      { id: 15, name: 'Magneta', powerId: 105 },
      { id: 16, name: 'RubberMan', powerId: 106 },
      { id: 17, name: 'Dynama', powerId: 107 },
      { id: 18, name: 'Dr IQ', powerId: 108 },
      { id: 19, name: 'Magma', powerId: 109 },
      { id: 20, name: 'Tornado', powerId: 110 },
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

    const powers = [
      { id: 101, description: 'Is a true friend' },
      { id: 102, description: 'Sleeps a lot' },
      { id: 103, description: 'Extremely excited' },
      { id: 104, description: 'Throws celery around' },
      { id: 105, description: 'Plays with magnets' },
      { id: 106, description: 'Bounces around the room' },
      { id: 107, description: 'Can change on a whim' },
      { id: 108, description: 'Says he is really smart' },
      { id: 109, description: 'Melts' },
      { id: 110, description: 'Spins quite fast' },
    ];

    return { heroes, locations, powers };
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
