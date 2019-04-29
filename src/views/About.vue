<template>
  <div class="container">
    <div class="notification">
      <p><strong>Project Notes:</strong> Game built using Vue, Vuex, Vue CLI, and Bulma as part of a front-end web development test. All people data pulled from the Open Source <a href="https://randomuser.me">Random User API</a>.</p>
      <p class="has-text-right">
        <b-button>
          <router-link to="/home">Close</router-link>
        </b-button>
      </p>
    </div>
  </div>
</template>
<style scoped>
  .notification a:not(.button):not(.dropdown-item){
    text-decoration: none;
  }
  
  .notification{
    margin: 2em 0;
  }
</style>