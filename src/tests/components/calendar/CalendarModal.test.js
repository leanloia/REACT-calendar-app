import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import moment from "moment";

import "@testing-library/jest-dom";
import { CalendarModal } from "../../../components/calendar/CalendarModal";
import {
  eventClearActiveEvent,
  eventStartUpdate,
  eventStartAddNew,
} from "../../../actions/events";
import { act } from "react-dom/cjs/react-dom-test-utils.development";
import Swal from "sweetalert2";

jest.mock("../../../actions/events", () => ({
  eventStartUpdate: jest.fn(),
  eventClearActiveEvent: jest.fn(),
  eventStartAddNew: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, "hours");
const nowPlusHour = now.clone().add(1, "hours");

const initState = {
  calendar: {
    events: [],
    activeEvent: {
      title: "hola mundo",
      notes: "algunas notas",
      start: now.toDate(),
      end: nowPlusHour.toDate(),
    },
  },
  auth: {
    uid: "abcd",
    name: "lean",
  },
  ui: {
    modalOpen: true,
  },
};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <CalendarModal />
  </Provider>
);

describe("Pruebas en CalendarModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("debe de mostrar el modal", () => {
    // esta prueba arroja un falso positivo, ya que pregunta si EXISTE (y claro que existe)
    // expect(wrapper.find(".modal").exists()).toBe(true);

    // intentemos hacer una prueba un poco más precisa
    expect(wrapper.find("Modal").prop("isOpen")).toBe(true);
  });

  test("debe llamar la accion de actualizar y cerrar modal", () => {
    // simulo el submit del form
    wrapper.find("form").simulate("submit", {
      preventDefault() {},
    });
    // si todo es correcto, el eventStartUpdate debe llamarse con el valor del evento activo (el que actualicé)
    expect(eventStartUpdate).toHaveBeenCalledWith(
      initState.calendar.activeEvent
    );
    // y debe llamarse el eventClearActiveEvent para limpiar ese evento activo
    expect(eventClearActiveEvent).toHaveBeenCalledWith();
  });

  test("debe de mostrar error si falta el título", () => {
    // simulo el submit, esta vez, como en el test anterior hice submit, el formulario se limpio, no tengo title, y tengo una validación para que el title sea necesario
    wrapper.find("form").simulate("submit", {
      preventDefault() {},
    });

    // por ende, esperaría que en dicho input, exista la prop 'is-invalid' que pinta de rojo el campo
    expect(wrapper.find('input[name="title"]').hasClass("is-invalid")).toBe(
      true
    );
  });

  test("debe de crear un nuevo evento correctamente", () => {
    // para crear un nuevo evento, por definición, no tengo que tener un activeEvent, por lo que defino nuevamente mi initState con esa característica
    const initState = {
      calendar: {
        events: [],
        activeEvent: null,
      },
      auth: {
        uid: "abcd",
        name: "lean",
      },
      ui: {
        modalOpen: true,
      },
    };
    const store = mockStore(initState);
    store.dispatch = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <CalendarModal />
      </Provider>
    );

    // defino los 'cambios' en los input del form...
    wrapper.find('input[name="title"]').simulate("change", {
      target: {
        name: "title",
        value: "hola pruebas",
      },
    });

    // ...simulo el submit del mismo
    wrapper.find("form").simulate("submit", {
      preventDefault() {},
    });

    // ... espero que se haya llamado al 'eventStartAddNew' y que se haya llamado luego al eventClearActiveEvent
    expect(eventStartAddNew).toHaveBeenLastCalledWith({
      end: expect.anything(),
      start: expect.anything(),
      title: "hola pruebas",
      notes: "",
    });

    expect(eventClearActiveEvent).toHaveBeenCalled();
  });

  test("debe de validar las fechas", () => {
    wrapper.find('input[name="title"]').simulate("change", {
      target: {
        name: "title",
        value: "Coso",
      },
    });
    const today = new Date();
    act(() => {
      wrapper.find("DateTimePicker").at(1).prop("onChange")(today);
    });

    wrapper.find("form").simulate("submit", {
      preventDefault() {},
    });

    expect(Swal.fire).toHaveBeenCalledWith("Error", "La fecha final debe ser posterior a la fecha inicial", "error");
  });
});
