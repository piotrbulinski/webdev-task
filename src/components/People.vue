<template>
  <div id="page-people" class="container">
    
    <div class="columns">
      <div class="column is-full">
        <b-button @click="$emit('new-deck')">Start Over</b-button> 
        <b-button @click="$emit('reset-deck')">Shuffle</b-button> 
        <!-- <b-button @click="$emit('post-results')">Post Results</b-button>  -->
        <span class="column is-pulled-right">
          <span><strong>{{ counter_title }}:</strong> {{ count }}</span>
        </span>
      </div>
    </div>
    <div class="columns is-mobile"  v-bind:class="{ 'card-size-small':card_small, 'card-size-tiny':card_tiny, 'card-size-minature':card_minature }">
      <div v-bind:key="person.id" v-for="person in deckOfPeople" class="column is-one-quarter">
        <PersonItem v-bind:person="person" @pick-card="$emit('pick-card',person)"/>
      </div>
    </div>
  </div>
</template>


<script>
// Get single tempalte
import PersonItem from './PersonItem.vue';
import store from '@/store';

export default {
  name: "People",
  components: {
    PersonItem
  },
  props: ["deckOfPeople"],
  mounted () {
    console.log('People.vue mounted now');
    var audio = new Audio('http://bhriv.com/sites/tectonic/game/audio/card-filp.mp3');
    audio.preload;
  },
  methods: {
  },
  computed: { // retrieve current data state 
    count () { // is computation is called by {{ count }} in the template
      return store.state.count
    },
    counter_title () {
      return store.state.counter_title
    },
    card_small () {
      return store.state.card_small
    },
    card_tiny () {
      return store.state.card_tiny
    },
    card_minature () {
      return store.state.card_minature
    }
  },
}
</script>

<style lang="scss" scoped>

  #top_controls{
    margin-bottom: 1em;
  }
  .columns{
    flex-wrap: wrap;
  }

  button{
    margin-right: 0.1rem;
  }
  

  .card-size-small.is-mobile > .column.is-one-quarter{
    width: 16.66%;
    padding: 0.44%;
    .box{
      height: 130px;

      h4{
        line-height: 1em;
      }
    }
  }

  .card-size-tiny.is-mobile > .column.is-one-quarter{
    width: 16.66%;
    margin: 0;
    padding: 0.44%;
    
    .box{
      height: 130px;

      img{
        width: 80%;
      }
      h4{
        font-size: 11px;
        line-height: 1em;
      }
    }
  }

  .card-size-minature.is-mobile > .column.is-one-quarter{
    width: 8.33%;
    margin: 0;
    padding: 0.44%;

    .box{
      height: 120px;

      img{
        width: 90%;
      }
      h4{
        font-size: 11px;
        line-height: 1em;
      }
    }
  }
</style>
