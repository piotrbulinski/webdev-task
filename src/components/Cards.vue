<template>
  <div>
    <div v-bind:key="card.id" v-for="card in deckOfCards">
      <CardItem v-bind:card="card" />
    </div>
  </div>
</template>


<script>
// Get single card tempalte
import CardItem from './CardItem.vue';

export default {
  name: "Cards",
  components: {
    CardItem
  },
  props: ["deckOfCards"],
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
