import Swal from "sweetalert2";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import "@testing-library/jest-dom";
import {
  startChecking,
  startLogin,
  startLogout,
  startRegister,
} from "../../actions/auth";
import { types } from "../../types/types";
import * as fetchModule from "../../helpers/fetch";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);

// hago un mock de sweetalert (es un paquete, por eso se hace de manera distinta al mock del Storage) y simulo el método 'fire' que es el que dispara el alerta
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

// hago un mock del Storage con jest.fn()
Storage.prototype.setItem = jest.fn();
Storage.prototype.clear = jest.fn();

let token = "";

describe("Pruebas en las acciones del auth", () => {
  beforeEach(() => {
    store = mockStore(initState);
    jest.clearAllMocks();
  });

  test("startLogin debe funcionar", async () => {
    // con el store, simulo el llamado dispatch a la action startLogin
    await store.dispatch(startLogin("lean@lean.com", "abcd1234"));

    // traigo, con getActions, las acciones llamadas por el store
    const actions = store.getActions();

    // evaluo dichas actiones (una, startLogin, en teoría) y cuál es el type y payload que devuelve
    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: expect.any(String),
        name: expect.any(String),
      },
    });

    // espero que el localStorage se haya llamado, con el Token y que el mismo sea de tipo String
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "Token",
      expect.any(String)
    );

    // ...y que el token-init-date sea un Number
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "Token-init-date",
      expect.any(Number)
    );

    // como setItem es un mock, puedo utilizar método mock.calls para ver con qué variables se llamó a dicha función (y, en este caso, extraer el token)
    let token = localStorage.setItem.mock.calls[0][1];
    // console.log('esto es el token', token)
  });

  test("startLogin debe funcionar correctamente cuando los valores no lo son", async () => {
    await store.dispatch(startLogin("tuvieja@tuvieja.com", "cacaculopedo"));
    const actions = store.getActions();

    // espero que, al pasar un dato incorrecto, ninguna actions sea dispatch-eada (?)
    expect(actions).toEqual([]);
    // y que se haya disparado el alerta con los argumentos correctos
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error",
      "User or password are incorrect.",
      "error"
    );
  });

  test("startRegister debe funcionar correctamente", async () => {
    // importo un módulo con todos los métodos de fetch (tema de read-only error avoided)
    fetchModule.fetchSinToken = jest.fn(() => ({
      // como la respuesta del fetchSinToken debe ejecutar un json, simulo ese callback con los datos del (intento de) logueo
      json() {
        return {
          ok: true,
          uid: "412412",
          name: "chota",
          token: "ASBFDSD",
        };
      },
    }));
    await store.dispatch(startRegister("test", "test2@test2.com", "123155t6"));

    const actions = store.getActions();
    // console.log(actions);

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: "412412",
        name: "chota",
      },
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("Token", "ASBFDSD");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "Token-init-date",
      expect.any(Number)
    );
  });

  test("startChecking debe funcionar correctamente", async () => {
    fetchModule.fetchConToken = jest.fn(() => ({
      json() {
        return {
          ok: true,
          uid: "412412",
          name: "chota",
          token: "ASBFDSD",
        };
      },
    }));

    await store.dispatch(startChecking());
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: "412412",
        name: "chota",
      },
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("Token", "ASBFDSD");
  });

  test("startLogout debe funcionar correctamente", async () => {
    await store.dispatch(startLogout());
    const actions = store.getActions();

    // console.log(actions)
    expect(actions[0]).toEqual({
      type: types.authLogout,
    });
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
