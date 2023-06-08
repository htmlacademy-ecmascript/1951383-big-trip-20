import { getOffersByTypes } from '../mock/offers.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = getOffersByTypes();

  get offers() {
    return this.#offers;
  }
}
