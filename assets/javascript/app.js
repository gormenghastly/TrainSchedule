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
  var newStart = 0;
  var newFreq = 0;

  console.log('hello');

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
    newStart = $('#first-time')
      .val()
      .trim();
    newFreq = $('#frequency')
      .val()
      .trim();

    //variable for storing user input
    console.log('New Name: ', newName);
    console.log('New Dest ', newDest);
    console.log('New start: ', newStart);
    console.log('New freq: ', newFreq);

    //push data to database
    database.ref().push({
      trainName: newName,
      trainDest: newDest,
      trainStart: newStart,
      trainFreq: newFreq
    });
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

      //variable for train frequency
      var frequency = childSnapshot.val().trainFreq;

      //variable for first train
      var startTime = moment(childSnapshot.val().trainStart, 'HH:mm');
      console.log('Start time: ', startTime.format('HH:mm'));

      //current time
      var currentTime = moment();
      console.log('current time: ' + currentTime.format('HH:mm'));

      if (currentTime.isBefore(startTime)) currentTime.add(1, 'day');

      //difference between current and start time
      var diffTime = moment.duration(currentTime.diff(startTime));
      console.log('difference in time: ' + diffTime.asMinutes());

      //remainder of time apart
      var timeRemain = diffTime % frequency;
      console.log('Remaining time: ', timeRemain);

      //minutes till next train
      var minutesToTrain = frequency - timeRemain;
      console.log('minutes to train: ' + minutesToTrain);

      //time of next arrival
      var nextArrival = moment().add(minutesToTrain, 'minutes');
      console.log('next arrival: ' + moment(nextArrival).format('hh:mm'));

      //appending new train and times to table

      $('#train-table').append(
        '<tr><td>' +
          childSnapshot.val().trainName +
          '</td><td>' +
          childSnapshot.val().trainDest +
          '</td><td>' +
          childSnapshot.val().trainFreq +
          '</td><td' +
          nextArrival.format('hh:mm') +
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
