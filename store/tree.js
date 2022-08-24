export const state = () => ({
  tree: [],
})

export const mutations = {
  setTree(state, value){
    state.tree = value;
  },
}

export const getters = {
  getTree: state => state.tree,
}

export const actions = {
  async requestTree({ commit, state }){
    await this.$axios('./tree.json').then((response)=>{
      commit('setTree', response.data);
    });
  },
}


