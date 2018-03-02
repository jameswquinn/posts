import Moon from 'moonjs'
import MoonRouter from 'moon-router'
import Monx from 'monx'

Moon.use(Monx);
const store = new Monx({
  state: {
    count: 0,
    added: [],
  all: [
    {
      id: 'cc919e21-ae5b-5e1f-d023-c40ee669520c',
      image: 'https://picsum.photos/300/300/?random',
      name: 'COBOL 101 vintage',
      description: 'Learn COBOL with this vintage programming book',
      price: 399
    },
    {
      id: 'bcd755a6-9a19-94e1-0a5d-426c0303454f',
      image: 'https://picsum.photos/300/301/?random',
      name: 'Sharp C2719 curved TV',
      description: 'Watch TV like never before with the brand new curved screen technology',
      price: 1995
    },
    {
      id: '727026b7-7f2f-c5a0-ace9-cc227e686b8e',
      image: 'https://picsum.photos/301/300/?random',
      name: 'Remmington X mechanical keyboard',
      description: 'Excellent for gaming and typing, this Remmington X keyboard ' +
        'features tactile, clicky switches for speed and accuracy',
      price: 595
    }
  ]
  },
  actions: {
    increment: (state, payload) => {
      state.count += payload;
    },
    decrement: (state, payload) => {
      state.count -= payload;
    }
  }
});
    // use Moon Router with Moon
    Moon.use(MoonRouter);

    const router = new MoonRouter({
        map: {
            "/": "Home",
            "/about": "About",
            "/work": "Work",
            "/contact": "Contact"
        },
         mode: "history"
    });
    Moon.component("Home", {
          template: 'Home'
      });
      Moon.component("About", {
          template:
          `About`,
            store: store
      });
      Moon.component("Work", {
          template:
          `Work`,
            store: store
      });
      Moon.component("Contact", {
        template:
        `<div>
             <h1>Contact</h1>
             <h1>{{store.state.count}}</h1>
             <button m-on:click="increment">Increment</button>
             <button m-on:click="decrement">Decrement</button>
             <p>This is the contact of your application!</p>
         </div>`,
         methods: {
    increment: function() {
      store.dispatch("increment", 1);
    },
    decrement: function() {
      store.dispatch("decrement", 1);
    }
  },
         store: store
    });
    // create new instance of moon, work inside of #app
    // and pass in the router for Moon to use

    new Moon({
        el: "#app",
        router: router
    });
