var React = require("react");
var ReactDOM = require("react-dom");
var WorldFeed = require("./components/WorldFeed.jsx");
                
function render(){
    var WorldFeedInstance = ReactDOM.render(<WorldFeed />, document.getElementById("container"));
}
render();

