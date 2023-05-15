import { getDestinations } from '../mock/destination.js';


export default class DestinationsModel {
  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }
}
