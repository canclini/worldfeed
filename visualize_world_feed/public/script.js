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
        if (! (server_country in data[start_ts]['country']))
            data[start_ts]['country'][server_country] = 0;
        if (! (language in data[start_ts]['language']))
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
        const config = {
          /* HighchartsConfig */
        };

        return <div>
                  <Highcharts config = {config}></Highcharts>
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

var WorldFeedInstance = React.render(
    <WorldFeed />,
    document.body
);
