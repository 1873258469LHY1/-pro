<template>
  <div>
    <Category />
    <SpuList v-if="!isShowAttrList" />
    <SpuAttrList v-else :item='item' />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuList from "./spuList";
import SpuAttrList from "./spuAttrList";

export default {
  name: "List",
  components: {
    Category,
    SpuList,
    SpuAttrList
  },
  data() {
    return {
        item:{},
      isShowAttrList: false,
    //   isShowAttrList: false,
    };
  },
  methods:{
      sendSpuId(row){
          this.item = {...row}
          this.isShowAttrList = true
      }
  },
  mounted(){
      this.$bus.$on("sendSpuId", this.sendSpuId);
  }
  
};
</script>