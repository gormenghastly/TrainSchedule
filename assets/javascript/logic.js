
 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyCwviyjqISHB7J3L0tRB4nMLmIKJAKDz6k",
  authDomain: "always-on-time-e4e35.firebaseapp.com",
  databaseURL: "https://always-on-time-e4e35.firebaseio.com",
  projectId: "always-on-time-e4e35",
  storageBucket: "always-on-time-e4e35.appspot.com",
  messagingSenderId: "242940836913"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function() {
  var newName = '';
  var newDest = '';
  var newStart = 0;
  var newFreq = 0;

  //capture button click
  $(document).on('click', '#submit', function(event) {
    event.preventDefault();

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
      'HH:mm'
    ).format('X');
    newFreq = $('#frequency')
      .val()
      .trim();

    //variable for storing user input
    var newTrain = {
      trainName: newName,
      trainDest: newDest,
      trainStart: newStart,
      trainFreq: newFreq
    };

    //push data to database
    database.ref().push({
      newTrain
    });


  });

  //Firebase watcher and initial loader
  database.ref().on(
    'child_added',
    function(childSnapshot) {
      //log all data coming from snapshot
      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().trainDest);
      console.log(childSnapshot.val().trainStart);
      console.log(childSnapshot.val().trainFreq);
      console.log(childSnapshot.val().joinDate);

        //variable for train frequency
  var frequency = childSnapshot.val().trainFreq;

  //variable for first train
  var startTime = childSnapshot.val().trainStart;

  //push back first train 1 yr so it comes before current time
  var startTimeConverted = moment(startTime, "HH:mm").subtract(1, 'years');
  console.log(startTimeConverted);

  //current time
  var currentTime = moment();
  console.log('current time: ' + moment(currentTime).format('hh:mm'));

  //difference between current and converted
  var diffTime = moment().diff(moment(startTimeConverted), 'minutes');
  console.log('difference in time: ' + diffTime);

  //remainder of time apart
  var timeRemain = diffTime % frequency;
  console.log(timeRemain);

  //minutes till next train
  var minutesToTrain = frequency - timeRemain;
  console.log('minutes to train: ' + minutesToTrain);

  //time of next arrival
  var nextArrival = moment().add(minutesToTrain, 'minutes');
  console.log('next arrival: ' = moment(nextArrival).format('hh:mm'));
    
    //appending new train and times to table  

      $('#train-table').append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().trainDest + "</td><td>" + childSnapshot.val().trainFreq + "</td><td" + minutesToTrain + "</td><td>" + nextArrival + "</td></tr>");
      //handle the errors
    },
    function(errorObject) {
      console.log('Errors handled: ' + errorObject.code);
    }
  );
  
});
