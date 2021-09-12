import { AxiosStatic } from 'Axios';
import { CookiesStatic } from "js-cookie";

export const fetchJsonp = require('fetch-jsonp');
export const deepmerge = require('deepmerge');

declare global {
  const Axios: AxiosStatic;
  const Cookies: CookiesStatic;
}

export * from "./initializer";
export * from "./banner";
export * from "./config";
export * from "./components";
