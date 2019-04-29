<template>
  <section class="section">
    <footer class="container">
      <p>
        <small>
          <router-link to="/about">See Project Info </router-link> &vert; 
          Created by <strong><a href="https://github.com/bhriv">@BHRIV</a></strong>
        </small>
      </p>
    </footer>
  </section>
</template>

<style lang="scss">
  footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
</style>
<script>
export default {
  name: "Header"
}
</script>

