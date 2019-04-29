<template>
  <div
    class="box has-background-white-ter" 
    v-bind:class="{'is-selected':person.selected, 'is-disabled':person.disabled, 'is-matched':person.matched }"
    @click="pickCard" 
  >
    
    <div v-if="person.selected || person.matched">
      <span>
        <!-- <h4>{{ person.name }}</h4> -->
          <img :src="person.thumbnail">
          <h4>{{ person.coffee }}</h4>
      </span>
    </div>  
    
  </div>
</template>


<style lang="scss" scoped>
  img{
    width: 50%;
  }

  // if counter = 3
  // .columns.is-mobile > .column.is-one-quarter{
  //   width: 12.5%;
  //   img{
  //     width: 75%;
  //   }
  // }
  
  h4{
    text-transform: capitalize;
    margin-bottom: 1em;
    font-weight: 600;
  }
  
  .box{
    height: 200px;
    padding: 1rem 0 0;
    backface-visibility: hidden; 
    text-align: center;
    img{
      border-radius: 50%;
      visibility: hidden;
    }
    &.is-selected{
      backface-visibility: visible; 
      // animation: rotate 1s ease 0s alternate none;
      animation: rotate 0.15s ease 0s alternate none;
      span{
        animation: fadeIn 0.4s ease 0.15s normal none;
      }
      img{
        visibility: visible;
      }
    }
    &.is-matched{
      backface-visibility: visible; 
      img{
        visibility: visible;
      }
    }

    @keyframes rotate {
      from {
        transform: rotateY(0deg); 
      }
      to {
        transform: rotateY(180deg);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0.8;
        width: 0;
      }
      to {
        opacity: 1;
        width: initial;
      }
    }
  }
</style>

<script>

import {_} from 'vue-underscore';

export default {
  name: "PersonItem",
  props: ["person","isSwitchedCustom"],
  methods: {
    pickCard() {
      // toggle boolean for the person.selected value
      this.person.selected = !this.person.selected;
      // console.log(this.deckOfPeople)
      // let twins = _.where(this.deckOfPeople,{title: this.person.title})
      // console.log(twins)

      this.$emit('pick-card',this.person)
      var audio = new Audio('http://bhriv.com/sites/tectonic/game/audio/card-filp.mp3');
      audio.play();
    }
  }
}
</script>




