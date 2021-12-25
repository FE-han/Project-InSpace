import MainView from "../views/MainView.js";
import LoginView from "../views/LoginView.js";
import SignupView from "../views/SignupView.js";
import TicketView from "../views/TicketView.js";
import FindView from "../views/FindView.js";
import SelectView from "../views/SelectView.js";
import PayCheckView from "../views/PayCheckView.js";
// import toString from "./common/toString.js";

const fs = require("fs");

function toString() {
  fs.readFile("toast.js", "utf-8", function (err, data) {
    console.log(data);
  });
}

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );
  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", view: LoginView },
    { path: "/signup", view: SignupView },
    { path: "/find", view: FindView },
    { path: "/select", view: SelectView },
    { path: "/main", view: MainView },
    { path: "/ticket", view: TicketView },
    { path: "/paycheck", view: PayCheckView },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: localStorage.getItem("id") ? routes[4] : routes[0],
      result: [location.pathname],
    };
  }

  const view = new match.route.view(getParams(match));

  document.querySelector("#root").innerHTML = view.getHtml();
  toString();
  view.defaultFunc();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.parentElement.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.parentElement.href);
    }
  });
  router();
});
