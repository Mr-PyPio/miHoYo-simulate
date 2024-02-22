
<template>
  <web-view :src="externalUrl"></web-view>
</template>
 
<script>
export default {
  data() {
    return {
      externalUrl: ''
    };
  },
  onLoad(e) {
	  this.externalUrl = decodeURIComponent(e.url)
	  console.log(e.url)
  }
};
</script>
 
<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
</style>