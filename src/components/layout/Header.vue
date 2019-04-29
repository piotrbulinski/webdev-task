<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-one-quarter" id="cup-holder">
            <div class="row cup espresso">
              <div class="pour_bottom"></div>
            </div>
          </div>
          <div class="column">
            <h1 class="title">Barista Memory Training</h1>
            <h2 class="subtitle">Know your customers. Know their order.</h2>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<style lang="scss">
  
  .row{
    margin-right: 1em;
    position: relative;
    float: right;
    &:before,
    &:after{
      position: absolute;
      content: '';
    }
  }
  $cup_height: 75px;
  #cup-holder{
    height: $cup_height;
    margin-bottom: 1rem;
  }
  .cup {
    margin-right: 2rem;
    float: left;
    width: 95px;
    height: $cup_height;
    background: #B7C3D0;
    border-radius: 3px 3px 40px 40px;
    z-index: 1;
    &:after{
      top: 5px;
      right: -22px;
      width: 30px;
      height: 40px;
      border: 8px solid #B7C3D0;
      border-radius: 35px;
    }
  }

  .pour_bottom {
    position: absolute;
    z-index: 10;
    background: #8B4C39;
    bottom: 6px;
    left: 4px;
    // height: 30px;
    // width: 87px;
    border-radius: 1px 1px 40px 40px;
    animation: espresso 8s ease-in 0s normal 1 forwards running;
    // animation: rotate 10s ease-out;
  }

  .pour_bottom:before {
    bottom: -25px;
    width: 100px;
    height: 30px;
    border-radius:  0px 0px 25px 25px;
    background: #1d1d1d;
  }

  // @TODO - Improve cup later
  // .pour_bottom:after {
  //   bottom: 10px;
  //   border-radius:  0px 0px 42px 42px;
  //   background: rgba(0, 0, 0, 0);
  //   animation: fill 8s ease-in 0s normal 1 forwards running;
  //   // left: calc(50% - $val);
  //   // border-bottom: $val solid #8B4C39;
  // }

  // .cup.latte{
  //   height: 100px;
  //   border-radius: 3px 3px 40px 40px;
  //   animation: latte 6s ease-in 1s normal 1 forwards running;
  //   .pour_bottom{
  //     background: #8B4C39;
  //   }
  // }

</style>

<script>
export default {
  name: "Header"
}
</script>


