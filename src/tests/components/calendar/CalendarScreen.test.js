import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { act } from "@testing-library/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "@testing-library/jest-dom";

import { CalendarScreen } from "../../../components/calendar/CalendarScreen";
import { eventSetActive } from "../../../actions/events";
import { messages } from "../../../helpers/calendar-messages-esp";
import { types } from "../../../types/types";

jest.mock("../../../actions/events", () => ({
  eventSetActive: jest.fn(),
  eventStartLoading: jest.fn(),
}));

Storage.prototype.setItem = jest.fn();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {
  calendar: {
    events: [],
  },
  auth: {
    uid: "abcd",
  },
  ui: {
    openModal: false,
  },
};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <CalendarScreen />
  </Provider>
);

describe("Pruebas en el CalendarScreen", () => {
  test("debe de mostrarse correctamente", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("pruebas con las interacciones del calendario", () => {
    // traigo al componente (no es necesario nada más que el nombre exacto)
    const calendar = wrapper.find("Calendar");
    // traigo la propiedad 'messages' de dicho componente...
    const calendarMessages = calendar.prop("messages");

    // ... y corroboro que la misma coincida con los que definí.
    expect(calendarMessages).toEqual(messages);

    // Para probar otra propiedad, la ejecuto
    calendar.prop("onDoubleClick")();
    // ... y -una de las maneras- pruebo que el dispatch haya sido llamado con dicha opcion
    // (puedo comprobar esto SOLO porque es una función SINCRONA)
    expect(store.dispatch).toHaveBeenCalledWith({ type: types.uiOpenModal });

    // en este caso, onSelectEvent recibe el evento entero, por lo que podamos 'crearlo' (no hace falta que sea uno real)
    calendar.prop("onSelectEvent")({
      start: "hola",
    });
    // en este caso -otra de las formas- hago un mock de la accion, y compruebo que se haya llamado con el mismo 'evento' creado
    expect(eventSetActive).toHaveBeenCalledWith({ start: "hola" });

    // utilizamos 'act' (de testing-library/react) porque este componente realiza una modificacion con el setState (???) y envolver test en 'act' garantiza que el test se haga lo más cercana a la experiencia de un usuario (lo garantiza)
    act(() => {
        // Para probar la propiedad onView, hago el llamado de la misma con el valor que recibe ('week')
      calendar.prop("onView")("week");
      // ... y espero que llame al localStorage con dicho dato, como lastView (debo hacer mock del Storage)
      expect(localStorage.setItem).toHaveBeenCalledWith("lastView", "week");
    });
  });
});
