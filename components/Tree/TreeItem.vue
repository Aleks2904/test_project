<template lang="pug">
  li.item-tree
    template(v-if="typeof item === 'object'")
      .item-tree__btn-list
        button.item-tree__btn-list__control(:class="{'open': tree}" @click="openCloseTree") {{name ? name : 'tree'}}
        div
          button.item-tree__btn-list__rename( @click="action(id, name, 'rename')" aria-label="rename")
          button.item-tree__btn-list__remove( @click="action(id, name, 'remove')" aria-label="remove")
      transition(name="list" )
        ul.item-tree__item-list(v-show="tree" )
          template(v-if="typeof el === 'object' && name !== '#_id'" v-for="(el, name, index) in item" )
            TreeItem( :item="el" :name="name" :id="item['#_id']" :key="name" :action="action")
          li.item-tree(v-else-if="name !== '#_id'")
            .item-tree__item-list__file
              span {{el}}
              div
                button.item-tree__btn-list__rename( @click="action(item['#_id'], el, 'rename', true)" aria-label="rename")
                button.item-tree__btn-list__remove( @click="action(item['#_id'], el, 'remove', true)" aria-label="remove")
    .item-tree__item-list__file(v-else)
      span {{item}}
      div
        button.item-tree__btn-list__rename( @click="action(id, item, 'rename', true)" aria-label="rename")
        button.item-tree__btn-list__remove( @click="action(id, item, 'remove', true)" aria-label="remove")


</template>

<script>
export default {
  name: 'TreeItem',
  props: ['item', 'name', 'id', 'action'],
  data:()=>{
    return{
      tree: false,
    }
  },
  methods:{
    openCloseTree(){
      this.tree = !this.tree;
    }
  }
}
</script>

<style scoped lang="scss">
.item-tree{
  &:not(:last-child){
    margin-bottom: 5px;
  }

  &__btn-list{
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 5px;

    > button{
      position: relative;
      padding-left: 30px;
      height: 24px;
      text-align: left;

      transition: background .2s, color .2s;

      @include hoverFocus{
        background: gray;
        color: white;
        transition: background .2s, color .2s;
      }

      &:after{
        content: '';
        display: block;

        width: 20px;
        height: 20px;

        position: absolute;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);

        background: url("/tree/Closed_Folder.png") center center/contain no-repeat;
      }
    }

    .open{
      &:after{
        background: url("/tree/Open_Folder.png") center center/contain no-repeat;
      }
    }

    >div{
      display: flex;
      align-items: center;
      button{
        &:not(:last-child){
          margin-right: 5px;
        }
      }
    }

    &__rename{
      width: 20px;
      height: 20px;
      background: url("/tree/edit.png") center center/contain no-repeat;
    }

    &__remove{
      width: 20px;
      height: 20px;
      background: url("/tree/delete.png") center center/contain no-repeat;
    }
  }


  &__item-list{
    overflow: hidden;
    padding-left: 24px;
    padding-top: 5px;

    &__file{
      padding-left: 30px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:after{
        content: '';
        display: block;
        width: 20px;
        height: 20px;

        position: absolute;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);

        background: url("/tree/blank-page.png") center center/contain no-repeat;
      }

      >div{
        button{
          &:not(:last-child){
            margin-right: 5px;
          }
        }
      }
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: max-height 0.5s;
  max-height: 1000px;
}
.list-enter,
.list-leave-to
{
  max-height: 0px;
}
</style>
