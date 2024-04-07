import { makeAutoObservable } from "mobx";

export default class CoordinatesStore {
    constructor() {
        this._isCoor = [];
        makeAutoObservable(this);
    }

    setIsCoor(coords) {
        this._isCoor = coords;
    }

    getIsCoor() {
        return this._isCoor;
    }
}
