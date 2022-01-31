<template>
  <fragment>
    <template v-for="item in eleList">
      <v-text v-if="item.type === 'text'" :key="item.id" :config="item" />
      <v-rect v-if="item.type === 'rect'" :key="item.id" :config="item" />
      <v-circle v-if="item.type === 'circle'" :key="item.id" :config="item" />
      <v-line v-if="item.type === 'line'" :key="item.id" :config="item" />
      <v-group v-if="item.type === 'group'" :key="item.id" :config="item">
        <workspace
          v-if="item.children && item.children.length"
          :eleList="item.children"
        ></workspace>
      </v-group>
    </template>
  </fragment>
</template>
<script>
export default {
  name: 'Workspace',
  props: {
    eleList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
