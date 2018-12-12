$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [],
    coData = [];
  var tData = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(230, 126, 34, 1.0)",
        pointBoarderColor: "rgba(230, 126, 34, 1.0)",
        backgroundColor: "rgba(230, 126, 34, 0.4)",
        pointHoverBackgroundColor: "rgba(230, 126, 34, 1.0)",
        pointHoverBorderColor: "rgba(230, 126, 34, 1.0)",
        data: temperatureData
      }
    ]
  }
  var hData = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(41, 128, 185, 1.0)",
        pointBoarderColor: "rgba(41, 128, 185, 1.0)",
        backgroundColor: "rgba(41, 128, 185, 0.4)",
        pointHoverBackgroundColor: "rgba(41, 128, 185, 1.0)",
        pointHoverBorderColor: "rgba(41, 128, 185, 1.0)",
        data: humidityData
      }
    ]
  }
  var cData = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'CO Level',
        yAxisID: 'COLevel',
        borderColor: "rgba(52, 73, 94, 1.0)",
        pointBoarderColor: "rgba(52, 73, 94, 1.0)",
        backgroundColor: "rgba(52, 73, 94, 0.4)",
        pointHoverBackgroundColor: "rgba(52, 73, 94, 1.0)",
        pointHoverBorderColor: "rgba(52, 73, 94, 1.0)",
        data: coData
      }
    ]
  }

  var tOption = {
    title: {
      display: true,
      text: 'Temperature',
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
      }]
    }
  }

  var hOption = {
    title: {
      display: true,
      text: 'Humidity',
      fontSize: 36  
    },
    scales: {
      yAxes: [{
        id: 'Humidity',
        type: 'linear',
        scaleLabel: {
          labelString: 'Humidity(%)',
          display: true
        },
        position: 'left',
      }]
    }
  }

  var cOption = {
    title: {
      display: true,
      text: 'CO Levels',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'COLevel',
        type: 'linear',
        scaleLabel: {
          labelString: 'CO Levels(ppm)',
          display: true
        },
        position: 'left',
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var lat = 0;
  var long = 0;
  var co = '-';
  var fire = 0;
  var tctx = document.getElementById("temp").getContext("2d");
  var hctx = document.getElementById("hum").getContext("2d");
  var cctx = document.getElementById("cog").getContext("2d");
  var tChart = new Chart(tctx, {
    type: 'line',
    data: tData,
    options: tOption
  });
  var hChart = new Chart(hctx, {
    type: 'line',
    data: hData,
    options: hOption
  });
  var cChart = new Chart(cctx, {
    type: 'line',
    data: cData,
    options: cOption
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
      fire = obj.fire;

      if (fire == 1) {
        $('.alert').show();
      } else {
        $('.alert').hide();
      }
      $('#temptext').text(obj.temperature);
      $('#humtext').text(obj.humidity);
      $('#long').text(long);
      $('#lat').text(lat);
      $('#long').text(long);
      $('#latlong').text(lat+','+long);
      $('#maps').attr('href', 'https://www.google.com/maps/search/?api=1&query='+lat+','+long);
      $('#co').text(co + ' ppm');
      // tChart.update();
      // hChart.update();
      cChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
