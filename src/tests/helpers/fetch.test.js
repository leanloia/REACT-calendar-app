import { fetchConToken, fetchSinToken } from "../../helpers/fetch";

describe("Pruebas en helper fetch.js", () => {
  let token = "";

  test("fetchSinToken debe de funcionar correctamente", async () => {
    const resp = await fetchSinToken(
      "auth",
      { email: "lean@lean.com", password: "abcd1234" },
      "POST"
    );

    // compruebo que resp es una respuesta a la llamada fetch que realiza el fetchSinToken
    expect(resp instanceof Response).toBe(true);

    const body = await resp.json();
    expect(body.ok).toBe(true);

    token = body.token;
  });

  test("fetchConToken debe de funcionar correctamente", async () => {
    // traigo token de la prueba anterior, en la que me logueo y obtengo uno
    // lo guardo en localStorage para poder hacer pruebas que requieran tener un token activo
    localStorage.setItem("Token", token);

    const resp = await fetchConToken("events/602bb12f40c43b061022b55r", {}, "DELETE");
    const body = await resp.json();

    expect(body.msg).toBe('Please, contact the admin.')
  });
});
