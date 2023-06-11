import { render, replace, remove } from '../framework/render.js';
import PointEditView from '../view/trip-point-edit.js';
import PointView from '../view/trip-point.js';
import { isEscKey } from '../utils/point.js';
import { Mode } from '../const.js';
import { UserAction, UpdateType } from '../const.js';


export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #destination = [];
  #allDestinations = [];
  #offers = [];
  #allOffers = [];
  #handleModeChange = null;
  #handleDataChange = null;
  #mode = Mode.DEFAULT;


  constructor({ eventListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, allDestinations, allOffers) {
    this.#point = point;
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      allDestinations: this.#allDestinations,
      allOffers: this.#allOffers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      allDestinations: this.#allDestinations,
      allOffers: this.#allOffers,
      onFormClick: this.#handleFormCloseClick,
      onDeleteClick: this.#handleDeleteClick
    });

    // проверка = был ли перезаписан объект.
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }


  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormCloseClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToCard();
  };
}