<template>
  <v-app style="background:#D2D2D2">
      
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
<style>
.drawer {
  background: #4f5962;
}
.theme--light.v-data-table tbody tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .05);
}
.theme--dark.v-data-table tbody tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .5);
}
.logout{
  text-align: end;
}
</style>
