// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  } else {
    firebase.initializeApp({
      apiKey: '',
      authDomain: '',
      projectId: ''
    });    
  }
}

function onSubmit(event) {
  event.preventDefault()

  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  } else {
    var username = document.getElementById('username')

    // Initialize Cloud Functions through Firebase
    var checkUsername = firebase.functions().httpsCallable('check_username_private');
    checkUsername({ 
      username: username.value 
    }).then(function(result) {
      // Read result of the Cloud Function.
      console.log(result);
      // ...
    }).catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log(error)
    })
  }

  return false
}

// Checks that Firebase has been imported.
// checkSetup();
