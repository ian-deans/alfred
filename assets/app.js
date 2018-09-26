const MENU_ITEMS = [
  "Slack",
  "Zoom",
  "Splitwise",
  "Roster"
]



connectFirebaseDB();
const db = firebase.database();
const usersdb = db.ref( 'users' );
const linksdb = db.ref( 'links' );

registerVueComponents();

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
// seedLinks();
// seedUser();



/** FUNCTIONS **/

function connectFirebaseDB() {
  const config = {
    apiKey: "AIzaSyCUqhSGdAgu9aTTB4b4mIGaUoiWIuaqOTg",
    authDomain: "alfred-1440e.firebaseapp.com",
    databaseURL: "https://alfred-1440e.firebaseio.com",
    projectId: "alfred-1440e",
    storageBucket: "alfred-1440e.appspot.com",
    messagingSenderId: "337358217627"
  };
  firebase.initializeApp( config );
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
    links.push( { text: link.text, url: link.url } )
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
  })

}

function seedLinks() {
  const links = [
    { url: 'https://github.com/ian-deans', text: 'GitHub' },
    { url: 'https://calendly.com/dashboard', text: 'Calendly' },
    { url: 'https://workforcenow.adp.com/public/index.htm', text: 'ADP' },
    { url: 'https://www.linkedin.com/feed/', text: 'LinkedIn' },
    { url: 'https://zoom.us/j/8501120243', text: 'Zoom Room' },
    { url: 'https://secure.splitwise.com/#/dashboard', text: 'Splitwise' },
    { url: 'https://docs.google.com/spreadsheets/d/1hUAW3JhzUb4MzyMTzxtNDRaORY2BO08je0N3SCX1E1c/edit#gid=0', text: 'Student Roster' },
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
