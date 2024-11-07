import Cookies from 'js-cookie';

/*
1. `name`: A string representing the name of the cookie.
2. `value`: A string representing the value to be stored in the cookie.
3. `options`: An optional parameter that allows you to specify additional options
for the cookie, such as expiration date, domain, path, etc. */

export function setCookie(name: string, value: string, options?: Cookies.CookieAttributes) {
  Cookies.set(name, value, options);
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function removeCookie(name: string, options?: Cookies.CookieAttributes) {
  Cookies.remove(name, options);
}

export function updateCookie(name: string, value: string, options?: Cookies.CookieAttributes) {
  Cookies.set(name, value, options);
}
