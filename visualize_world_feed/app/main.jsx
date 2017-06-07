var React = require("react");
var ReactDOM = require("react-dom");
var SchoolsList = require("./components/SchoolsList.jsx");
var WorldFeed = require("./components/WorldFeed.jsx");

var _schools = [{name:"Lovedale",tagline:"this is a wonderful school"},
                {name:"Bishop",tagline:"Another great school"}];
                
function render(){
    var WorldFeedInstance = ReactDOM.render(<WorldFeed />, document.getElementById("container"));
    //ReactDOM.render(<SchoolsList schools={_schools} />, document.getElementById("container"));    
}
render();

