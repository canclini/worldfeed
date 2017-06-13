var React = require("react");
var ReactHighcharts = require('react-highcharts');
var ReactDOM = require('react-dom');

const io = require('socket.io-client')  
const socket = io();


module.exports = React.createClass({
    knownCountries: [],
    knownLanguages: [],

    getInitialState: function(){
        return { searchString: '', data: {} };
    },

    handleChange: function(e){
        this.setState({ searchString:e.target.value });
    },

    pushData: function(d) {
        var v          = JSON.parse(d);
        start_ts       = new Date(v['start']);
        end_ts         = new Date(v['end']);
        server_country = v['server_country'];
        language       = v['language'];
        count          = v['count'];

        data           = this.state.data;

        // Remember countries and langagues in a list
        if (this.knownCountries.indexOf(server_country) < 0)
          this.knownCountries.push(server_country);
        if (this.knownLanguages.indexOf(language) < 0)
          this.knownLanguages.push(language);

        // Initialize a new Timestamp
        if (! (start_ts in data)) {
            data[start_ts] = {language: {}, country: {}};
            this.knownCountries.forEach(function(c) { 
              data[start_ts]['country'][c] = 0;
            });
            this.knownLanguages.forEach(function(l) { 
              data[start_ts]['language'][l] = 0;
            });
        }

        // Handle new countries and languages for the current timestamp
        if (! (server_country in data[start_ts]['country']))
            data[start_ts]['country'][server_country] = 0;
        if (! (language in data[start_ts]['language']))
            data[start_ts]['language'][language] = 0;

        // Count!
        data[start_ts]['country'][server_country] += count;
        data[start_ts]['language'][language] += count;

        this.setState({data: data});
    },

    componentDidMount: function(){
        socket.on('message', this.pushData);
    },

    render: function() {
        var that = this; 
        var language_series = Object.keys(that.knownLanguages).map(function(i) {
                                lang = that.knownLanguages[i];
                                // Reformat timeseries for Highcharts
                                return { name: lang, 
                                         data: Object.keys(that.state.data).map(function(ts) {
                                                 return that.state.data[ts]['language'][lang] || 0
                                               })
                                       }
                              });
        var country_series = Object.keys(that.knownCountries).map(function(i) {
                                country = that.knownCountries[i];
                                // Reformat timeseries for Highcharts
                                return { name: country, 
                                         data: Object.keys(that.state.data).map(function(ts) {
                                                 return that.state.data[ts]['country'][country] || 0
                                               })  
                                       }
                              });
        /* HighchartsConfig */
        timestamps = Object.keys(that.state.data)
        var language_config = {
          title: {text: 'Languages'},
          plotOptions: {
              line: {
                  animation: false
              }
          },
          xAxis: {
            categories: timestamps,
            type: 'datetime'
          },
          series: language_series
        };
        var country_config = {
          title: {text: 'Countries'},
          plotOptions: {
              line: {
                  animation: false
              }
          },
          xAxis: {
            categories: timestamps,
            type: 'datetime'
          },
          series: country_series
        };

        return <div>
                  <ReactHighcharts config={language_config} />
                  <ReactHighcharts config={country_config} />
                  { Object.keys(that.state.data).map(function (timestamp) {
                      return <div>
                               <h3>{timestamp}</h3>
                               <h4>Languages</h4>
                               <ul>
                                 { Object.keys(that.state.data[timestamp]['language']).map(function (language) {
                                   return <li>{language}: {that.state.data[timestamp]['language'][language]}</li>
                                 }) }
                               </ul> 
                               <h4>Countries</h4>
                               <ul>
                                 { Object.keys(that.state.data[timestamp]['country']).map(function (country) {
                                   return <li>{country}: {that.state.data[timestamp]['country'][country]}</li>
                                 }) }
                               </ul> 
                             </div>
                  }) }
                </div>;

    }
});
