<template>
  <h1>Konten Component Accountmanagement</h1>

  <input type="text" v-model="nameis" v-on:keyup.enter="PostApi()">
  <table>
    <tr>
      <td>Id</td>
      <td>Accounts</td>
      <td>Balance</td>
      <td>Actions</td>
      <td></td>
    </tr>
    <tr v-for="account of accounts" :key="account.id">
      <td>{{account.id}}</td>
      <td>{{account.name}}</td>
      <td>{{account.balance}}</td>
      <input type="text" v-model="account.einzahlung" />

      <!-- <td><button @click="PutApi(todo.id,todo.name)">Update {{todo.id}} {{todo.name}} </button></td> -->
      <td><button @click="einzahlen2(account.id, account.einzahlung, account.name, account.balance)">Einzahlen {{account.einzahlung}} </button></td>
      <td><button @click="DeleteApi(account.id)">Delete {{account.id}}</button></td>
    </tr>
  </table>
</template>

<script>
import axios from "axios";
const baseUrl="http://localhost:3000/accounts/";
export default {
  name: 'AccountManagement',
  data(){
    return{
      accounts:[],
      nameis:'',
      betrag: null,
      einzahlung: null,
      balance: null,
      accountsDos:[],
      account: null
    }
  },
  props: {
    msg: String
  },
  methods:{
    async GetApi(){
      await axios
      .get(baseUrl)
      .then(resp=>{
        this.accounts = resp.data;
      })
      .catch(err=>{console.log(err)}
      );
    },
    // async GetBalance(id){
    //   fetch(baseUrl + id).
    //   then(res => res.json()).
    //   then(data =>this.account = data)
    // },
    async GetBalance(id){
      await axios
      .get(baseUrl + id).
      then(res =>{
        console.log("grrl");
        this.balance = res.data.balance;
        console.log(this.balance);
      })
      .catch(err=>{console.log(err)}
      );
    },
    async PostApi(){
      await axios
      .post(baseUrl,{name: this.nameis})
      .then(resp=>{
        console.log(resp);
        this.nameis = "";
        this.GetApi();
      })
      .catch(err=>{console.log(err)});
    },
    async PutApi(id, name){
      await axios
      .put(baseUrl+id,{name:name})
      .then(resp=>{
        console.log(resp);
        this.GetApi();
      })
      .catch(err=>{console.log(err)});
    },
    async PlusApi(id, balance, name, einzahlung){
      await axios
      .put(baseUrl+id,{balance: balance, name: name, einzahlung:einzahlung})
      .then(resp=>{
        //console.log(resp);
        console.log("balance plus:  " + balance);
        console.log("einzahlung plus:  " + einzahlung);
        this.GetApi();
      })
      .catch(err=>{console.log(err)});
    },
    async DeleteApi(id){
      await axios
      .delete(baseUrl+id)
      .then(resp=>{
        console.log(resp);

        this.GetApi();
      })
      .catch(err=>{console.log(err)});
    },
    einzahlen(id, betrag, name){
      this.balance = null;
      console.log ("Betrag" + betrag);
      this.GetBalance(id);
      console.log("balance: " + this.balance);
    this.summe = Number(this.balance) + betrag;
    console.log(this.summe);
    this.PlusApi(id, this.summe, name)
    },
    einzahlen2(id, betrag, name, balance, einzahlung)
    {
      console.log ("Betrag" + betrag);
      console.log ("einzahlung" + einzahlung);
      console.log(balance + ' ' + betrag);
      this.summe = Number(balance) + Number(betrag);
      this.PlusApi(id, this.summe, name, betrag)
    }
  },

  mounted(){
    this.GetApi();

    //version netNinja
    // fetch(baseUrl).
    // then(res => res.json()).
    // then(data =>this.accountsDos = data)


  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
