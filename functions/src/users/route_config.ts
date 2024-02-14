import {Application} from "express";
import {all, create, get, login, patch, remove} from "./controller";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

export const routesConfig = (app: Application) => {
  app.post("/login", login);
  app.post("/user",
    // isAuthenticated,
    // isAuthorized({hasRole: ["Teacher"]}),
    create
  );
  app.get("/users", [
    isAuthenticated,
    isAuthorized({hasRole: ["Teacher"]}),
    all,
  ]);

  app.get("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["Teacher"], allowSameUser: true}),
    get,
  ]);
  // updates :id user
  app.patch("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["Teacher"], allowSameUser: true}),
    patch,
  ]);
  // deletes :id user
  app.delete("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["Teacher"]}),
    remove,
  ]);
};
