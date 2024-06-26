<template>
	<div v-if="account">
		<h1>{{account.name}}</h1>
		{{ account }}
		<p>id: {{ id }}</p>

		<div>

		<div class="container">
			<div class="row">
				<div class="col-md-6">

					<div class="row align-items-center p-3">
						<div class="col-sm"></div>
						<div class="col-sm"></div>
						
						<div class="bg-primary col-sm align-self-end" style="height: 200px; background-color:blueviolet; border-radius: 5px">
							
							<h2 class="text-light">{{account.balance}} EUR</h2>
						</div>

						<div class="col-sm"></div>
						<div class="col-sm"></div>
					</div>

					<div class="row align-items-center p-3">
						<div class="col-sm"></div>
					</div>

				</div>				
				<!-- <div class="bg-info col-sm" >
				  
  
				  
				  <div style="height: 150px; border-radius: 5px; background-color:lightslategrey;">
					<h4>Betrag auszahlen</h4>  

					  <input type="text" class="form-control" name="betrag">

					  <button class="bg-primary">Auszahlen</button>
				   </div>

				  
				</div> -->
				<div class="col-md-6">
					<div class="col-sm" style="height: 200px; background-color:blueviolet; border-radius: 5px">
						<h4>Auszahlung vornehmen</h4>
						<label for="betreff">Betreff</label>
						<input type="text" class="form-control" name="betreff" v-model="this.betreff">
						<label for="betrag">Betrag</label>
						<input type="text" class="form-control" name="betrag" v-model="this.betrag">		
						<button type="button" class="btn btn-outline-dark" @click="auszahlen(account.id, betrag, account.balance, account.name, account.active, betreff)">Auszahlen</button>
					</div>
					<div class="col-sm"></div>
				</div>


			</div>
		  </div>

		</div>

	</div>
	<div v-else>
		...loading
		<hr>
		maybe there is the need to start json server 
		<br>
		npx json-server data/db/json
	</div>

  <!-- <p>id: {{ $route.params.id}}</p> -->

</template>

<script>
import axios from "axios";

const baseUrl="http://localhost:3000/accounts/";
const baseUrlDos="http://localhost:3000/logs/";

export default {
	props: {
		id: {
		  type: Number,
		  required: true
		},
		//['id'],
	},
	data(){
		return {
			account: [],
			logData: [],
			betrag: null,
			betreff: null,
			currentTimestamp: {},
			formattedDateTime: null
		}
	},
	methods:{
		//einzahlen(id, betrag, balance, name, active){
		auszahlen(id, betrag, balance, name, active, betreff){
			console.log("Balance von " + this.account.balance +
			" um betrag " + betrag + " verringern");
			// console.log("NAME: " + name);
			// console.log("alte Summe: " + balance);
			//console.log("active: " + active);
			this.summe = Number(balance) - Number(betrag);
			console.log("neue Summe: " + this.summe);
			this.PlusApi(id, this.summe, name, betrag, active);
			this.log(id, 0, betrag, betreff);
		},
		async log(fromId, toId, betrag, betreff){
			const maxId = Math.max(...this.logData.map(item => item.logId));
			await axios
			.post(baseUrlDos,{logId:maxId + 1, fromId: fromId, toId: toId, date: this.currentTimestamp, betrag: betrag, betreff: betreff })
			.then(resp=>{
				console.log(resp);
				//this.GetApiLogs();
			})
			.catch(err=>{console.log(err)});
		},
		async PlusApi(id, balance, name, einzahlung, active){
			await axios
			.put(baseUrl+id,{balance: balance, name: name, einzahlung:einzahlung, active: active})
			.then(resp=>{
				//console.log(resp);
				// console.log("balance plus:  " + balance);
				// console.log("einzahlung plus:  " + einzahlung);
			//	this.GetApi();
				alert("success: Von Konto " + name + "(" + id + ") wurde eine Auszahlung von " + einzahlung + " Euro vorgenommen!");
				this.GetApi();
			})
			.catch(err=>{console.log(err)});
		},
		async GetApi(){
			await axios
				.get(baseUrl)
				.then(resp=>{
					this.accountsDos = resp.data;
				})
				.catch(err=>{console.log(err)}
				);
		},
		fetchAccount() {
			fetch('http://localhost:3000/accounts/' + this.id)
				.then(response => response.json())
				.then(data => this.account = data)
				.catch(err => console.log(err.message));
			}
	},
	mounted(){
		// fetch('http://localhost:3000/accounts/' + this.id)
		// .then(response => response.json())
		// .then(data => this.account = data)
		// .catch(err => console.log(err.message));
		this.fetchAccount;

		const currentTimestamp = new Date();
			const year = currentTimestamp.getFullYear();
			const month = ('0' + (currentTimestamp.getMonth() + 1)).slice(-2); // Monat von 0 (Januar) bis 11 (Dezember)
			const day = ('0' + currentTimestamp.getDate()).slice(-2);
			const hours = ('0' + currentTimestamp.getHours()).slice(-2);
			const minutes = ('0' + currentTimestamp.getMinutes()).slice(-2);
			const seconds = ('0' + currentTimestamp.getSeconds()).slice(-2);
			this.currentTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		
	},
	watch: {
    	id: 'fetchAccount'
  },

}
</script>

<style>

</style>