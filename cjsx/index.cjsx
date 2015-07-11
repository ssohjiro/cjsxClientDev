# @cjsx React.DOM
### jshint browser:true, devel:true, node:true, undef:true, unused:strict ###

React = require('react')
Router = require('react-router')
RouteHandler = Router.RouteHandler
Route = Router.Route
Backbone = require('backbone')

Menu = React.createClass
  render: ->
    <div>menu</div>

App = React.createClass
  render: ->
    <div>
      <Menu />
      <RouteHandler/>
    </div>


routes =
  <Route handler={App}>
    <Route path="about" />
    <Route path="inbox" />
  </Route>

React.render(<HelloWorld />, document.body)

