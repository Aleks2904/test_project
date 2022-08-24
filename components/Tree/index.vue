<template lang="pug">
  .tree
    ul
      template(v-for="(item, name, i) in treeObject")
        TreeItem(v-if="name !== '#_id'" :item="item" :name="name" :key="name" :id="treeObject['#_id']" :action="actionsController")
    transition(name="form" )
      form.tree__form(@submit="changeTree" v-if="showRenameForm")
        button(type="button" aria-label="close rename" @click="()=>{this.showRenameForm = false}")
        input(ref="input" placeholder="Rename" v-model="rename" )
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex';
import TreeItem from "~/components/Tree/TreeItem";

export default {
  name: 'RenderTree',
  components: {TreeItem},
  data:()=>{
    return{
      rename: '',
      beforeName: '',
      showRenameForm: false,
      treeObject: {},
      action: 'rename',
      isFile: false,
    }
  },
  methods:{
    ...mapActions('tree', ['requestTree']),
    ...mapMutations('tree', ['setTree']),

    changeTree(e){
      if(this.action === 'rename'){
        e.preventDefault();
        if(!this.rename) return;
      }

      const newTreeObject = {};
      Object.assign(newTreeObject, this.treeObject);

      const changeObj = (obj) => {
        for(let key in obj){
          const newObj = typeof obj[key] === 'object' ? obj[key] : null;

          if(key === this.beforeName){
            const newKey = this.generationKey(this.rename);
            if(this.action === 'rename'){
              if(this.isFile){
                obj[key] = this.rename;
              }
              else{
                delete Object.assign(obj, {[newKey]: obj[this.beforeName] })[this.beforeName];
              }
            }
            if(this.action === 'remove'){
              delete Object.assign(obj)[this.beforeName];
            }
            break;
          };

          if(newObj) changeObj(newObj);
        }
      }

      changeObj(newTreeObject);

      const objectWrapper = {
        0: newTreeObject
      };

      this.setTree(objectWrapper);
      this.showRenameForm = false;
      this.rename = '';
    },

    actionsController(name, action, file = false){
      this.beforeName = name;
      this.action = action;
      this.isFile = file;

      if(action === 'rename') {
        this.showRenameForm = true;
        setTimeout(()=>{
          this.$refs.input.focus();
        })
      }

      if(action === 'remove') this.changeTree();
    },

    generationKey(key){
      return  key + '#_hash:' + Math.random();
    },

    setHash(el){
      const arr = JSON.parse(JSON.stringify(el));
      const tree = arr[0];

       const enumerationOfTheObject = (object) =>{
        for(let key in object){
          let nextObject = object[key];

          if(key.indexOf('#_hash:') < 0){
            const newKey = this.generationKey(key)
            delete Object.assign( object, {[newKey]: object[key] })[key];
            nextObject = object[newKey];
          }

          if(typeof nextObject === 'object'){
            enumerationOfTheObject(nextObject)
          }
        }
      };
      enumerationOfTheObject(tree);
      this.treeObject = tree;
    },
  },

  computed:{
    ...mapGetters('tree',['getTree']),
  },

  watch:{
    getTree:{
      handler(el){
        this.setHash(el);
      },
      deep: true,
    }
  },

  async mounted() {
    await this.requestTree();
    this.setHash(this.getTree);
  }
}
</script>

<style scoped lang="scss">

.tree{
  position: relative;
  padding: 15px;

  &__form{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    button{
      display: block;
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      transition: background .3s;

      @include hoverFocus{
        background: rgba(0,0,0,0.7);
        transition: background .3s;
      }
    }

    input{
      position: relative;
      z-index: 2;
      background: white;
      padding: 5px;
    }
  }
}

.form-enter-active,
.form-leave-active {
  transition: opacity 0.5s;
}
.form-enter,
.form-leave-to {
  opacity: 0;
}
</style>
