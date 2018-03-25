// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCVCbGVvkMmXk5W2PFUbLa3xEI-iiPu_xk',
  authDomain: 'train-schedule-685a1.firebaseapp.com',
  databaseURL: 'https://train-schedule-685a1.firebaseio.com',
  projectId: 'train-schedule-685a1',
  storageBucket: '',
  messagingSenderId: '850926047507'
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function() {
  var newName = '';
  var newDest = '';
  var newStart = 0;
  var newFreq = 0;

  $(document).on('click', 'submit', function() {
    event.preventDefault();

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
      'DD/MM/YY'
    ).format('X');
    newFreq = $('#frequency')
      .val()
      .trim();

    var newTrain = {
      trainName: newName,
      trainDest: newDest,
      trainStart: newStart,
      trainFreq: newFreq
    };

    database.ref().push({
      newTrain,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  database.ref().on('child_added', function(childSnapshot) {
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDest);
    console.log(childSnapshot.val().trainStart);
    console.log(childSnapshot.val().trainFreq);
    console.log(childSnapshot.val().joinDate);

    $('#train-table').append;
  });
});
