import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import thunk from "redux-thunk";
import configureStore from "redux-mock-store";

import "@testing-library/jest-dom";

import { DeleteEventFab } from "../../../components/ui/DeleteEventFab";
import { startEventDeleted } from "../../../actions/events";

// hago un mock de la acción, la cual es dispatch-eada por el botón del componente DeleteEventFab
jest.mock("../../../actions/events", () => ({
  startEventDeleted: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <DeleteEventFab />
  </Provider>
);

describe("Pruebas en DeleteEventFab component", () => {
  test("debe de mostrarse correctamente", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("debe disparar la acción al hacer click en el botón", () => {
    wrapper.find("button").prop("onClick")();

    // si no hubiese utilizado este mock, podría haber chequeado que "alguna" función se llamaba pero a mi me interesa saber que esa puntual es la utilizada
    // y hago mock ya que hay muchos niveles de anidamiento ( wrapper -> button -> handleDelete -> dispatch -> startEventDeleted)
    expect(startEventDeleted).toHaveBeenCalledWith();
  });
});
