var WorldFeed = React.createClass({

    getInitialState: function(){
        return { searchString: '', data: {} };
    },

    handleChange: function(e){
        this.setState({ searchString:e.target.value });
    },

    pushData: function(d) {
        var v          = JSON.parse(d);
        start_ts       = v['start'];
        end_ts         = v['end'];
        server_country = v['server_country'];
        language       = v['language'];
        count          = v['count'];

        data           = this.state.data;

        if (! (start_ts in data))
            data[start_ts] = {language: {}, country: {}};
        if (! (server_country in data[start_ts]))
            data[start_ts]['country'][server_country] = 0;
        if (! (language in data[start_ts]))
            data[start_ts]['language'][language] = 0;

        data[start_ts]['country'][server_country] += count;
        data[start_ts]['language'][language] += count;

        console.log(data);
        this.setState({data: data});
    },

    componentDidMount: function(){
        var socket = io();
        socket.on('message', this.pushData);
    },

    render: function() {
        var that = this;
        return <div>
                  { Object.keys(that.state.data).map(function (key) {
                      return <div>
                               <h3>{key}</h3>
                               <h4>Languages</h4>
                               <ul>
                                 { Object.keys(that.state.data[key]['language']).map(function (key2) {
                                   return <li>{key2}: {that.state.data[key]['language'][key2]}</li>
                                 }) }
                               </ul> 
                               <h4>Countries</h4>
                               <ul>
                                 { Object.keys(that.state.data[key]['country']).map(function (key2) {
                                   return <li>{key2}: {that.state.data[key]['country'][key2]}</li>
                                 }) }
                               </ul> 
                             </div>
                  }) }
                </div>;

    }
});

                                                                                                                                                             
var libraries = [

    { name: 'Backbone.js', url: 'http://documentcloud.github.io/backbone/'},
    { name: 'AngularJS', url: 'https://angularjs.org/'},
    { name: 'jQuery', url: 'http://jquery.com/'},
    { name: 'Prototype', url: 'http://www.prototypejs.org/'},
    { name: 'React', url: 'http://facebook.github.io/react/'},
    { name: 'Ember', url: 'http://emberjs.com/'},
    { name: 'Knockout.js', url: 'http://knockoutjs.com/'},
    { name: 'Dojo', url: 'http://dojotoolkit.org/'},
    { name: 'Mootools', url: 'http://mootools.net/'},
    { name: 'Underscore', url: 'http://documentcloud.github.io/underscore/'},
    { name: 'Lodash', url: 'http://lodash.com/'},
    { name: 'Moment', url: 'http://momentjs.com/'},
    { name: 'Express', url: 'http://expressjs.com/'},
    { name: 'Koa', url: 'http://koajs.com/'},

];


var WorldFeedInstance = React.render(
    <WorldFeed items={libraries} />,
    document.body
);
