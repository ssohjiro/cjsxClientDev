
/* jshint browser:true, devel:true, node:true, undef:true, unused:strict */
var App, Layout, React, Route, RouteHandler, Router, routes;

React = require('react');

Router = require('react-router');

RouteHandler = Router.RouteHandler;

Route = Router.Route;

Layout = require('./layout.jsx');

App = React.createClass({
  render: function() {
    return React.createElement("div", null, "Hello world");
  }
});

App = React.createClass({
  render: function() {
    return React.createElement("div", null, React.createElement("h1", null, "App"), React.createElement(RouteHandler, null));
  }
});

routes = React.createElement(Route, {
  "handler": App
}, React.createElement(Route, {
  "path": "about",
  "handler": About
}), React.createElement(Route, {
  "path": "inbox",
  "handler": Inbox
}));

React.render(React.createElement(Layout, {
  "title": "hi"
}, React.createElement(HelloWorld, null)), document.body);
