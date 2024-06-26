<template>
  <div class="about">
    <h1>Kontoauszug</h1>
  </div>
  <div v-if="logData">
    <!-- {{ logData }} -->
  </div>

  <table class="table table-striped">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Datum</th>
      <th scope="col">Betreff</th>
      <th scope="col">von Konto</th>
      <th scope="col">zu Konto</th>
      <th scope="col">Betrag</th>
      <th scope="col">Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="entry in logData" :key="entry.id">
      <th scope="row">{{entry.id}}</th>
      <td>{{entry.date}}</td>
      <td>{{entry.betreff}}</td>
      <td>{{entry.fromId}} </td>
      <td>{{entry.toId}} </td>
      <td>{{entry.betrag}} EUR</td>
      <td>
        <button type="button" title="delete Log + `${entry.betreff}`" class="btn btn-info"  @click="DeleteApiLog(entry.id)">X</button>
        <button type="button" title="reset Action" class="btn btn-warning"  @click="ResetBuchung(entry.id)"><-</button>
      </td>
      <!-- <td><button>Delete {{todo.id}}</button></td> -->
    </tr>
    </tbody>
  </table>

  <p>test</p>

  <!-- <div ref="tabulator"></div> -->

</template>

<script>
import axios from "axios";
import Tabulator from "tabulator-tables";

const baseUrlDos="http://localhost:3000/logs/";
const baseUrl="http://localhost:3000/accounts/";


export default {
  data(){
    return {
      logData: [],
      singleLogData: [],
      konto: [],
    }
  },
  methods:{
    async GetApiLogs(){
			await axios
				.get(baseUrlDos)
				.then(resp=>{
					this.logData = resp.data;
				})
				.catch(err=>{console.log(err)}
				);
			},
      async DeleteApiLog(id){
      await axios
      .delete(baseUrlDos+id)
      .then(resp=>{
        console.log(resp);

        this.GetApiLogs();
      })
      .catch(err=>{console.log(err)});
    },
    async ResetBuchung(id){
     // this.konto = [];
      this.singleLogData = [];

      //alert("2do: Löschen des Logseintrags + Summenkorrektur");
			await axios
      .get(baseUrlDos+id)
				.then(resp=>{
					this.singleLogData = resp.data;
				})
				.catch(err=>{console.log(err)}
				);

        console.log(
          this.singleLogData.id,
          this.singleLogData.fromId,
          this.singleLogData.toId,
          this.singleLogData.betrag,
          this.singleLogData);
        
          this.loadAccountData(this.singleLogData.toId);
		},
    async loadAccountData(account_id){
      this.konto = [];
      await axios
      .get(baseUrl + account_id)
      .then(resp=>{
					this.konto = resp.data;
				})
				.catch(err=>{console.log(err)}
				);

      console.log(this.konto.id, this.konto.balance, this.konto.name, this.konto.betrag);

      //TODO(Manu) this.konto.balance von this.konto um this.singleLogData.betrag verringern
      this.konto.balance -= this.singleLogData.betrag;
      console.log("this.konto.balance nach reset: " + this.konto.balance);

      //das noch für db.json updaten
      this.PlusApi(this.konto.id, this.konto.balance, this.konto.name, this.konto.einzahlung);

    },
    async PlusApi(id, balance, name, einzahlung){
      await axios
      .put(baseUrl+id,{balance: balance, name: name, einzahlung: einzahlung})
      .then(resp=>{
        //console.log(resp);
        console.log("balance plus:  " + balance);
        console.log("einzahlung default:  " + einzahlung);

        console.log("jetzt auch noch log löschen mit id " + this.singleLogData.id)
        this.DeleteApiLog(this.singleLogData.id);
      })
      .catch(err=>{console.log(err)});
    },
  },
  mounted(){
    this.GetApiLogs();

    // // Daten für die Tabelle
    // const tableData = [
    //   {id: 1, name: 'John', age: 30},
    //   {id: 2, name: 'Jane', age: 25}
    //   // Weitere Daten hier einfügen
    // ];

    // // Tabulator-Optionen
    // const tableOptions = {
    //   data: tableData,
    //   columns: [
    //     {title: 'ID', field: 'id'},
    //     {title: 'Name', field: 'name'},
    //     {title: 'Age', field: 'age'}
    //     // Weitere Spalten hier einfügen
    //   ]
    //   // Weitere Tabulator-Optionen hier einfügen
    // };

    // // Tabulator-Tabelle erstellen
    // new Tabulator(this.$refs.tabulator, tableOptions);

    //     // Daten für die Tabelle
    //     const tableData = [
    //   {id: 1, name: 'John', age: 30},
    //   {id: 2, name: 'Jane', age: 25}
    //   // Weitere Daten hier einfügen
    // ];

    // // Tabulator-Tabelle erstellen
    // const table = new Tabulator(this.$refs.tabulator, {
    //   data: tableData,
    //   columns: [
    //     {title: 'ID', field: 'id'},
    //     {title: 'Name', field: 'name'},
    //     {title: 'Age', field: 'age'}
    //     // Weitere Spalten hier einfügen
    //   ]
    //   // Weitere Tabulator-Optionen hier einfügen
    // });
    
    // table.setData(tableData); // Daten in die Tabelle einfügen
  }
}
</script>

