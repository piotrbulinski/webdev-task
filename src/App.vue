<template>
  <div id="app">
    <Header />
    <router-view/>
    <div class="portrait-notification">
      <b-notification
          type="is-danger"
          aria-close-label="Close notification"
          role="alert">
          Please rotate your device to landscape mode to enjoy the game.
      </b-notification>
    </div>
    <section class="game-table" v-if="people_api_error">
      <ApiError />
      <Cards v-bind:deckOfCards="deckOfCards" /> 
    </section>

    <section class="game-table" v-else>
      <div v-if="people_api_loading">
        <b-notification aria-close-label="Close notification" role="alert">
          Loading Data
        </b-notification>
        
      </div>
      <People 
        v-on:post-results="postResults" 
        v-on:new-deck="newDeck" 
        v-on:reset-deck="resetDeck" 
        v-bind:deckOfPeople="deckOfPeople" 
        @pick-card="pickCard"
      /> 
    </section>

    <Footer />
  </div>
</template>

<script>

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Cards from './components/Cards';
import People from './components/People';
import ApiError from './components/layout/ApiError';
import store from './store';

// Vendor
import axios from 'axios';
import {_} from 'vue-underscore';

const thought_foundry_api_base = 'https://evtask.t12y.net/' 
const bhriv_tectonic_api_base = 'http://bhriv.com/sites/tectonic/wp-json/' 

const deck_deal = new Audio('http://bhriv.com/sites/tectonic/game/audio/Card-flip-sound-effect.mp3');
deck_deal.preload;

const success_audio = new Audio('http://bhriv.com/sites/tectonic/game/audio/success.mp3');
success_audio.preload;
// App 
export default {
  name:"app",
  components: {
    Header,
    Footer,
    Cards,
    People,
    ApiError
  },
  data() {
    return {
      deckOfCards: initCardDeck(),
      deckOfPeople: null,
      people_api_error: false,
      people_api_error_msg: null,
      people_api_loading: true,
      pairs_to_match: store.state.pairs,
      radio: "Jack"
    }
  },
  created() {
    console.log('App created now');
    console.log('count: '+store.state.count) // -> 1
  },
  mounted () {
    console.log('App mounted now');
    this.gameStart()
  },
  methods: {
    postResults: function () {
      console.info('postResults');
      let payload = {
        PuzzleResult: 'result-'+Date.now()
      }

      axios.post(thought_foundry_api_base+'results', {
        PuzzleResult: 'result-'+Date.now()
      })
      .then(function (response) {
        console.log(response);
        this.$toast.open({
          message: 'Results Posted. Server response: '+response,
          type: 'is-success',
          position: 'is-bottom',
          duration: 1000
        })
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },
    newDeck: function () {
      // New game stared. User can read instructions prior to starting timer
      console.info('New deck');
      this.deckOfPeople = null
      store.commit('resetGameCount')
      store.commit('incrementGameCount')
      this.createDeckOfPeople()
      // deck_audio.play();
    },
    gameStart: function () {
      // New game stared. User can read instructions prior to starting timer
      console.info('Game started');
      store.commit('incrementGameCount')
      this.createDeckOfPeople()
      // deck_audio.play();
    },
    gameEnded: function () {
      // fire at the end of the game. Use to trigger posting the results
      console.info('Game ended');
      success_audio.play();
      store.commit('incrementPairsCount')
      
      this.$toast.open({
          message: 'Nice Job. Here\'s the next level ',
          type: 'is-success',
          position: 'is-bottom',
          duration: 3000
      })
      this.postResults()
      this.gameStart()   
    },
    gameTimeout: function () {
      // @TODO - possibly have a setting for max time each game
      console.info('Game Timeout - timer ended');
    },
    gameFail: function () {
      // @TODO - possibly have a setting for max wrong answers
      console.info('Game fail - too many wrong answers');
    },
    resetDeck: function (){
      console.log('resetDeck')
      let newDeck = this.deckOfPeople;
      for (var i = 0; i < newDeck.length; i++) {
        newDeck[i].selected = false
        newDeck[i].matched = false
        newDeck[i].disabled = 0
      }
      deck_deal.play();
      this.deckOfPeople = _.shuffle(newDeck);
    },
    pickCard: function (person){
      console.log('App.vue pickCard fired for person ID: ',person)
      let choices = _.where(this.deckOfPeople,{selected: true})

      if(choices.length == 2){
        this.checkSelections(choices)
      }else{
        let twin = _.where(this.deckOfPeople,{title: person.title})
        twin = _.find(twin,{selected: false})
        console.log('twin',twin)
      }
    },
    checkSelections: function (choices) {
      console.log('fired checkSelectedCards',choices);
      for (var i = 0; i < choices.length; i++) {
        if (choices[0].title === choices[1].title) {
          console.log('Matched Pair Found!!')
          choices[0].matched = true
          choices[0].disabled = 1
          choices[1].matched = true
          choices[1].disabled = 1
        }else{
          setTimeout(function () {
            deck_deal.play();
          }, 1050)
        }
        
        setTimeout(function () {
          choices[0].selected = false
          choices[1].selected = false
        }, 1000)
      }
      if (_.find(this.deckOfPeople,{matched: false}) ) {
        console.log('keep going') 
      }else{
        console.log('Game Over !****')
        setTimeout(this.gameEnded, 1000)
      }
    },
    createDeckOfPeople: function () {
      console.log('createDeckOfPeople')
      let multiplier = store.state.count
      // if (store.state.count > 3) {
      //   multiplier = Math.pow(store.state.count,2)
      // }

      console.log('multiplier: '+multiplier)
      axios
        .get('https://randomuser.me/api/?inc=name,picture&results='+this.pairs_to_match*multiplier)
        // .get('https://evtask.t12y.net/assets')
        .then(response => {
          // People Data from API
          let peopleData = response.data.results
          // Generate random coffee orders
          let coffeeData = _.first(_.shuffle(store.state.coffee),peopleData.length)
          
          // Create Double Stack Deck
          peopleData = peopleData.concat(peopleData);
          coffeeData = coffeeData.concat(coffeeData);
          // console.log('peopleData concat',peopleData)
          // Add data
          for (var i = 0; i < peopleData.length; i++) {
            peopleData[i] = {
              id: i,
              coffee: coffeeData[i],
              title: peopleData[i].name.first+'-'+peopleData[i].name.last,
              name: peopleData[i].name.first+' '+peopleData[i].name.last,
              thumbnail: peopleData[i].picture.medium,
              selected: false,
              matched: false,
              disabled: false,

            }
          }
          
          // Separate Memory Game Data from API Data for future expansion
          // Avoid duplicated ID
          let memoryData = [];

          for (var j = 0; j < peopleData.length; j++) {
           memoryData[j] = {
              id: j,
              title: peopleData[j].title, 
              name: peopleData[j].name, 
              coffee: peopleData[j].coffee, 
              thumbnail: peopleData[j].thumbnail, 
              coffee: coffeeData[j],
              selected: false,
              matched: false,
              disabled: false
            }
          }

          this.deckOfPeople = _.shuffle(memoryData);
          
          // Play should effect if ready
          var playSoundEffect = deck_deal.play();

          if (playSoundEffect !== undefined) {
            playSoundEffect.then(_ => {
              console.log('playSoundEffect play started')
            })
            .catch(error => {
              console.log('playSoundEffect not ready',error)
            });
          }

          // deck_deal.play()
          console.log('deck of People with memoryData',memoryData)
          // Shuffle Deck
          
        })
        .catch(error => {
          console.log(error)
          this.people_api_error = true
          this.people_api_error_msg = error
        })
        .finally(() => setTimeout(this.people_api_loading = false, 1000) )
    }
  },
  watch: {
    deckOfPeople: function(newValue, oldValue) {
      console.log('deckOfPeople: Watch fired')
      store.commit('incrementAppClass')
    },
  },
}

function updateAppClass() {
  let level = store.state.count+1
  return 'level-'+level
}

// FUNCTIONS OUTSIDE OF APP - TO PERSIST DATA MODEL
// Used to reset the data to resart the game
function initCardDeck() {
  // console.log('initCardDeck')

  return [
    {
      id: 0,
      title: "Ace",
      selected: false,
      disabled: 0,
      matched: false
    },
    {
      id: 1,
      title: "King",
      selected: false,
      disabled: 0,
      matched: false
    },
    {
      id: 2,
      title: "Queen",
      selected: false,
      disabled: 0,
      matched: false
    },
    {
      id: 3,
      title: "Jack",
      selected: false,
      disabled: 0,
      matched: false
    }
  ] 
}
</script>

<!-- Use Material Design Icons -->
<style type="text/css" href="https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css"></style>
<!-- Bulma / Buefy Styles -->
<style lang="scss">
  @import "./sass/all";
  .game-table{
    padding: 1em;
  }
  .hero-body{
    padding: 2rem;
  }

</style>
