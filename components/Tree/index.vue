<template lang="pug">
  .tree
    ul
      template(v-for="(item, name, i) in obg")
        TreeItem(v-if="name !== '#_id'" :item="item" :name="name" :key="name" :id="obg['#_id']" :action="actionFN")
    transition(name="form" )
      form.tree__form(@submit="changeObject" v-if="showRenameForm")
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
      renameID: '',
      beforeName: '',
      showRenameForm: false,
      obg: {},
      action: 'rename',
      isFile: false,
    }
  },
  methods:{
    ...mapActions('tree', ['requestTree']),
    ...mapMutations('tree', ['setTree']),

    changeObject(e){
      if(this.action === 'rename'){
        e.preventDefault();
        if(!this.rename) return;
      }

      const newObject = {};
      Object.assign(newObject, this.obg);

      if(newObject['#_id'] === this.renameID){
        if(!this.isFile && this.action === 'rename'){
          delete Object.assign( newObject, {[this.rename]: newObject[this.beforeName] })[this.beforeName];
        };

        if(!this.isFile && this.action === 'remove'){
          delete Object.assign( newObject)[this.beforeName];
        };

        if(this.isFile){
          for(let key in newObject){
            if(newObject[key] === this.beforeName){
              if(this.action === 'rename'){
                newObject[key] = this.rename;
              };
              if(this.action === 'remove'){
                delete Object.assign(newObject)[key];
              };
            }
          }
        }
      }
      else{
        const changeObj = (obg) =>{
          for(let key in obg){
            if(!this.isFile && obg[key]['#_id'] === this.renameID) {
              if (this.action === 'rename') {
                delete Object.assign(obg[key], {[this.rename]: obg[key][this.beforeName]})[this.beforeName];
              };
              if (this.action === 'remove') {
                delete Object.assign(obg[key])[this.beforeName];
              };
              break;
            }
            if(this.isFile && obg['#_id'] === this.renameID && obg[key]=== this.beforeName){
              if(this.action === 'rename'){
                obg[key] = this.rename;
              };
              if(this.action === 'remove'){
                delete Object.assign(obg)[key];
              };
              break;
            }
            if(typeof obg[key] === 'object') {
              changeObj(obg[key]);
            };
          }
        }

        changeObj(newObject);
      };

      const objectWrapper = {
        0: newObject
      };

      this.setTree(objectWrapper);
      this.showRenameForm = false;
      this.rename = '';
    },

    actionFN(id, name, action, file = false){
      this.renameID = id;
      this.beforeName = name;
      this.action = action;
      this.isFile = file;

      if(action === 'rename') {
        this.showRenameForm = true;
        setTimeout(()=>{
          this.$refs.input.focus();
        })
      }
      if(action === 'remove') this.changeObject();
    },

    setId(el){
      const arr = JSON.parse(JSON.stringify(el));
      const tree = arr[0];
      if(!tree['#_id']) tree['#_id'] = Math.random();

      function enumerationOfTheObject(object){
        for(let el in object){
          if(typeof object[el] === 'object'){
            if(!object[el]['#_id'])object[el]['#_id'] = Math.random();
            enumerationOfTheObject(object[el])
          }
        }
      };
      enumerationOfTheObject(tree);
      this.obg = tree;
    },
  },

  computed:{
    ...mapGetters('tree',['getTree']),
  },

  watch:{
    getTree:{
      handler(el){
        this.setId(el);
      },
      deep: true,
    }
  },

  async mounted() {
    await this.requestTree();
    this.setId(this.getTree);
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
