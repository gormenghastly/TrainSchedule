$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyCwviyjqISHB7J3L0tRB4nMLmIKJAKDz6k',
    authDomain: 'always-on-time-e4e35.firebaseapp.com',
    databaseURL: 'https://always-on-time-e4e35.firebaseio.com',
    projectId: 'always-on-time-e4e35',
    storageBucket: 'always-on-time-e4e35.appspot.com',
    messagingSenderId: '242940836913'
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var newName = '';
  var newDest = '';
  var newStart = '';
  var newFreq = 0;

  //capture button click
  $('#submit').on('click', function(event) {
    event.preventDefault();
    var firstTime = $('#first-time')
      .val()
      .trim();
    //grab user input
    newName = $('#train-name')
      .val()
      .trim();
    newDest = $('#destination')
      .val()
      .trim();
    newStart = moment(
      $('#first-time')
        .val()
        .trim(),
      'hh:mm'
    ).format('X');
    newFreq = $('#frequency')
      .val()
      .trim();

    //push data to database
    database.ref().push({
      trainName: newName,
      trainDest: newDest,
      trainStart: newStart,
      trainFreq: newFreq
    });

    //log all data pushed to database
    console.log('New Name: ', newName);
    console.log('New Dest ', newDest);
    console.log('New start: ', newStart);
    console.log('New freq: ', newFreq);

    //clear input fields
    $('#train-name').val('');
    $('#destination').val('');
    $('#first-time').val('');
    $('#frequency').val('');
  });

  //Firebase watcher and initial loader
  database.ref().on(
    'child_added',
    function(childSnapshot) {
      //log all data coming from snapshot
      console.log('Train Name: ', childSnapshot.val().trainName);
      console.log('Train Destination: ', childSnapshot.val().trainDest);
      console.log('Train Start: ', childSnapshot.val().trainStart);
      console.log('Frequency: ', childSnapshot.val().trainFreq);

      //variable for first train
      var startTime = childSnapshot.val().trainStart;

      //variable for train frequency
      var frequency = childSnapshot.val().trainFreq;

      //subtract year to start time
      var trainStartConverted = moment(startTime, 'HH:mm').subtract(1, 'years');
      console.log(trainStartConverted);

      //current time
      var currentTime = moment();
      console.log('current time: ' + moment(currentTime).format('hh:mm'));

      //difference between current and start time
      var diffTime = moment().diff(moment(trainStartConverted), 'minutes');
      console.log('diff in time: ' + diffTime);

      //remainder of time apart
      var timeRemain = diffTime % frequency;
      console.log(timeRemain);

      //minutes till next train
      var minutesToTrain = frequency - timeRemain;
      console.log('minutes to train: ' + minutesToTrain);

      //adding minutes to next train arrival
      var nextTrain = moment().add(minutesToTrain, 'minutes');
      console.log('arrival time: ' + moment(nextTrain).format('hh:mm'));

      //time of next arrival
      var nextArrival = moment(nextTrain).format('hh:mm');
      console.log('next arrival: ' + nextArrival);

      //appending new train and times to table

      $('#train-table').append(
        '<tr><td>' +
          childSnapshot.val().trainName +
          '</td><td>' +
          childSnapshot.val().trainDest +
          '</td><td>' +
          childSnapshot.val().trainFreq +
          '</td><td>' +
          nextArrival +
          '</td><td>' +
          minutesToTrain +
          '</td></tr>'
      );
      //handle the errors
    },
    function(errorObject) {
      console.log('Errors handled: ' + errorObject.code);
    }
  );
});
