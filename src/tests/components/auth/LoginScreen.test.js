import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import thunk from "redux-thunk";
import configureStore from "redux-mock-store";

import "@testing-library/jest-dom";
import { LoginScreen } from "../../../components/auth/LoginScreen";
import { startLogin, startRegister } from "../../../actions/auth";
import Swal from "sweetalert2";

// hago mock de mi acción startLogin
jest.mock("../../../actions/auth", () => ({
  startLogin: jest.fn(),
  startRegister: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <LoginScreen />
  </Provider>
);

describe("Pruebas en LoginScreen component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("debe mostrarse correctamente", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("debe de llamar el dispatch del login", () => {
    // busco mis dos inputs, y simulo el cambio en ellos:
    wrapper.find('input[name="lEmail"]').simulate("change", {
      target: {
        name: "lEmail",
        value: "prueba@prueba.com",
      },
    });
    wrapper.find('input[name="lPassword"]').simulate("change", {
      target: {
        name: "lPassword",
        value: "1111111",
      },
    });

    // ... luego busco el form, y llamo a la función 'onSubmit', y le paso una función vacía llamada preventDefault para evitar el error
    wrapper.find("form").at(0).prop("onSubmit")({
      preventDefault() {},
    });

    // Espero que el startLogin (hecho mock al inicio) haya sido llamada con los valores que cambié en cada input
    expect(startLogin).toHaveBeenCalledWith("prueba@prueba.com", "1111111");
  });

  test("no hay registro si las contraseñas son diferentes", () => {
    wrapper.find('input[name="rPassword"]').simulate("change", {
      target: {
        name: "rPassword",
        value: "aaaaaaaa",
      },
    });
    wrapper.find('input[name="rPassword2"]').simulate("change", {
      target: {
        name: "rPassword2",
        value: "bbbbbbbb",
      },
    });

    wrapper.find("form").at(1).prop("onSubmit")({
      preventDefault() {},
    });

    // 1-2 - startRegister no sea llamado
    expect(startRegister).not.toHaveBeenCalled();

    // el Swal.fire se haya llamado con los argumentos correspondientes
    expect(Swal.fire).toHaveBeenLastCalledWith(
      "Error",
      "Las contraseñas no coinciden",
      "error"
    );
  });

  test("debe dispararse el registro si las contraseñas son iguales", () => {
    wrapper.find('input[name="rPassword"]').simulate("change", {
      target: {
        name: "rName",
        value: "hola",
      },
    });
    wrapper.find('input[name="rPassword"]').simulate("change", {
      target: {
        name: "rEmail",
        value: "hola@hola.com",
      },
    });
    wrapper.find('input[name="rPassword"]').simulate("change", {
      target: {
        name: "rPassword",
        value: "aaaaaaaa",
      },
    });
    wrapper.find('input[name="rPassword2"]').simulate("change", {
      target: {
        name: "rPassword2",
        value: "aaaaaaaa",
      },
    });

    wrapper.find("form").at(1).prop("onSubmit")({
      preventDefault() {},
    });

    // 1-2 - startRegister sea llamado con los valores del formulario
    expect(startRegister).toHaveBeenCalledWith('hola', 'hola@hola.com', 'aaaaaaaa');

    // el Swal.fire no se haya llamado
    expect(Swal.fire).not.toHaveBeenCalled();
  });
});
