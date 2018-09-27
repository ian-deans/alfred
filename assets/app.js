const MENU_ITEMS = [
  "Slack",
  "Zoom",
  "Splitwise",
  "Roster"
]

const today = moment().startOf( 'day' ).format();
const endOfDay = moment().endOf( 'day' ).format();

const config = {
  google: {
    'apiKey': 'AIzaSyB1LJJJWWayc8A6U-OLt_C4d4FG5bO78c8',
    'clientId': '337358217627-io7oq95ddglvt64ca2lkpj6o4iljce8s.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/calendar.readonly',
  },

  CALENDAR_API_URL: `https://www.googleapis.com/calendar/v3/calendars/hnng0croa7kvcpuv22ah54ea20@group.calendar.google.com/events?timeMin=${today}&timeMax=${endOfDay}`,

  firebase: {
    apiKey: "AIzaSyCUqhSGdAgu9aTTB4b4mIGaUoiWIuaqOTg",
    authDomain: "alfred-1440e.firebaseapp.com",
    databaseURL: "https://alfred-1440e.firebaseio.com",
    projectId: "alfred-1440e",
    storageBucket: "alfred-1440e.appspot.com",
    messagingSenderId: "337358217627"
  }
}

  // const authorizeButton = document.getElementById('authorize-button');
  // const signoutButton = document.getElementById('signout-button');

connectFirebaseDB();
const db = firebase.database();
const usersdb = db.ref( 'users' );
const linksdb = db.ref( 'links' );
registerVueComponents();
loadGoogleClient();

// Create Vue UI elements
const navBar = new Vue( {
  el: '#navbar',
  data: {
    links: []
  }
} )
const menu = new Vue( {
  el: '#menu',
  data: {
    labels: MENU_ITEMS
  }
} )

loadFromDB()


/** FUNCTIONS **/

function connectFirebaseDB() {
  firebase.initializeApp( config.firebase );
}

function loadFromDB() {
  usersdb.once( 'value', printUser );
  linksdb.once( 'value', processLinks );
}

function printUser( snapshot ) {
  console.log( snapshot.val() );
}

function processLinks( snapshot ) {
  let links = [];
  snapshot.forEach( linkObj => {
    link = linkObj.val()
    links.push( {
      text: link.text,
      url: link.url
    } )
    sessionStorage.setItem( link.text, link.url )
  } )
  navBar.links = links;
}

function registerVueComponents() {
  Vue.component( 'nav-item', {
    props: [ 'link' ],
    template: '<a target="_blank" :href="link.url">{{ link.text }}</a>'
  } )

  Vue.component( 'menu-item', {
    props: [ 'label' ],
    template: '<span class="menu-item">{{ label }}</span>'
  } )

}

function seedLinks() {
  const links = [ {
      url: 'https://github.com/ian-deans',
      text: 'GitHub'
    },
    {
      url: 'https://calendly.com/dashboard',
      text: 'Calendly'
    },
    {
      url: 'https://workforcenow.adp.com/public/index.htm',
      text: 'ADP'
    },
    {
      url: 'https://www.linkedin.com/feed/',
      text: 'LinkedIn'
    },
    {
      url: 'https://zoom.us/j/8501120243',
      text: 'Zoom Room'
    },
    {
      url: 'https://secure.splitwise.com/#/dashboard',
      text: 'Splitwise'
    },
    {
      url: 'https://docs.google.com/spreadsheets/d/1hUAW3JhzUb4MzyMTzxtNDRaORY2BO08je0N3SCX1E1c/edit#gid=0',
      text: 'Student Roster'
    },
  ]

  links.map( link => linksdb.push( link ) );
}

function seedUser() {
  let user = {
    name: "Ian Deans",
    email: "ideans715@gmail.com",
  };

  usersdb.push( user )
  console.log( 'User seeded' );
}



function loadGoogleClient() {
  gapi.load( 'client:auth2', initGoogleClient );
}

function initGoogleClient() {
  gapi.client.init( config.google )
    .then( requestCalendarEvents )
    .then( loadCalendarEvents )
}

function requestCalendarEvents() {
  return gapi.client.request( config.CALENDAR_API_URL )
}

function loadCalendarEvents( apiResponse ) {
  apiResponse.result.items.map( item => {
    console.log( item );
  });
}

function updateSigninStatus( isSignedIn ) {
  if ( isSignedIn ) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none'
  }
}

function handleAuthClick( event ) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick( event ) {
  gapi.auth2.getAuthInstance().signOut();
}

function listUpcomingEvents() {
  console.log( gapi.client )
  gapi.client.calendar.events.list( {
    'calendarId': 'primary',
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
  } ).then( response => {
    let events = response.result.items;
    console.log( events )
  } )
}


// var keys = []

// document.body.addEventListener('keydown', function(e){
//   keys[e.key] = true
//   console.log(e.key)
//   console.log(keys)
// })
// document.body.addEventListener('keyup', e => {
//   keys[e.key] = false
//   console.log(e.key)
//   console.log(keys)
// })