import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import thunk from "redux-thunk";
import configureStore from "redux-mock-store";

import "@testing-library/jest-dom";
import { AppRouter } from "../../components/router/AppRouter";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Pruebas en AppRouter", () => {
  test("debe de mostrar el mensaje de espera", () => {
    const initState = {
      auth: {
        checking: true,
      },
    };
    const store = mockStore(initState);
    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find("h5").exists()).toBe(true);
  });

  test("debe de mostrar la ruta pública", () => {
    // si mi estado inicial tiene checking en false, y no tengo uid (es decir, no estoy logueado)...
    const initState = {
      auth: {
        checking: false,
        uid: null,
      },
    };
    const store = mockStore(initState);
    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    // ... entonces esperaría tener un elemento con esta clase, que es el formulario de login.
    expect(wrapper.find(".login-container").exists()).toBe(true);
  });

  test("debe de mostrar la ruta privada", () => {
    // si mi estado inicial tiene checking en false, y tengo uid (es decir, estoy logueado)...
    const initState = {
      ui: {
        modalOpen: false,
      },
      calendar: {
        events: [],
      },
      auth: {
        checking: false,
        uid: "abcd1234",
        name: "pepe",
      },
    };
    const store = mockStore(initState);
    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    // no uso el snapshot ya que el calendario, por su misma naturaleza, va a cambiar mes a mes.
    // expect(wrapper).toMatchSnapshot();
    // ... entonces esperaría tener un elemento con esta clase, que es un elemento del CalendarScreen.
    expect(wrapper.find(".calendar-screen").exists()).toBe(true);
  });
});
