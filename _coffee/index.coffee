
### jshint browser:true, devel:true, node:true, undef:true, unused:strict ###

React = require('react')
Router = require('react-router')
RouteHandler = Router.RouteHandler
Route = Router.Route
Backbone = require('backbone')

Menu = React.createClass
  render: ->
    React.createElement(React.DOM.div, null, "menu")

App = React.createClass
  render: ->
    React.createElement(React.DOM.div, null,
      React.createElement(Menu, null),
      React.createElement(RouteHandler, null)
    )


routes =
  React.createElement(Route, {"handler": (App)},
    React.createElement(Route, {"path": "about"}),
    React.createElement(Route, {"path": "inbox"})
  )

React.render(React.createElement(HelloWorld, null), document.body)

