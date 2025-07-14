<template>
  <svg-icon type="mdi" :path="path"></svg-icon>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlusCircle } from '@mdi/js';

export default {
  name: "addIcon",
  components: {
    SvgIcon
  },
  data() {
    return {
       path: mdiPlusCircle,
    }
  }
}
</script>