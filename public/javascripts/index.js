$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [],
    coData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      },
      {
        fill: false,
        label: 'CO Levels',
        yAxisID: 'CO Levels',
        borderColor: "rgba(54, 30, 24, 1)",
        pointBoarderColor: "rgba(54, 30, 24, 1)",
        backgroundColor: "rgba(54, 30, 24, 0.4)",
        pointHoverBackgroundColor: "rgba(54, 30, 24, 1)",
        pointHoverBorderColor: "rgba(54, 30, 24, 1)",
        data: coData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature, Humidity and CO levels',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          }
        }, {
          id: 'CO Levels',
          type: 'linear',
          scaleLabel: {
            labelString: 'CO(ppm)',
            display: true
          }
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var lat = 0;
  var long = 0;
  var co = '-';
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: true }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature || !obj.lat || !obj.long) {
        return;
      }
      lat = obj.lat;
      long = obj.long;
      co = obj.co;
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      if (obj.co) {
        coData.push(obj.co);
      }
      if (coData.length > maxLen) {
        coData.shift();
      }

      $('#lat').text(lat);
      $('#long').text(long);
      $('#latlong').text(lat+','+long);
      $('#maps').attr('href', 'https://www.google.com/maps/search/?api=1&query='+lat+','+long);
      $('#co').text(co + ' ppm');
      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
