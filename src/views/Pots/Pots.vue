<template>

	<div class="container">

		<div v-if="accounts">

			<!-- {{ accounts }}

			<hr> -->

			<!-- {{ accountsDos }} -->
			{{ currentTimestamp }} 
			<!-- <br> digitMonat {{ digitMonat }}
			<br> in wortlaut {{ currentMonth }}
			<br>  April {{ year[4] }}
			<br> Juni? {{calculatedMonth}} -->
		

	
			<table class="table table-striped">
				<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Konto</th>
					<th scope="col">Balance</th>
					<th scope="col">easybank</th>
					<th scope="col">monatlich</th>
					<th scope="col">Action</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="account in accountsDos" :key="account.id">
					<th scope="row">{{account.id}}</th>
					<td>{{account.name}}</td>
					<td>{{account.balance}} EUR</td>
					<td v-if="account.active">yes </td>
					<td v-else>no </td>
					<td>{{account.einzahlung}} EUR</td>
					<td>
						<router-link :to="{ name: 'PotDetails', params: { id: account.id}}">
							<button type="button" class="btn btn-secondary mx-1">go to</button>
						</router-link>
						<!-- <button type="button" class="btn btn-secondary" @click="action2(account.id)">Action2</button> -->
						<button type="button" class="btn btn-warning mx-1" @click="einzahlen(account.id, account.einzahlung, account.balance, account.name, account.active) ">+{{account.einzahlung}}</button>
						<button type="button" class="btn btn-success">...</button>
					</td>
				</tr>
				</tbody>
			</table>

			<h2>gespartes Kapital (Easybank und Bundesschatz): {{calculatedSum}} EUR</h2>
	
		<!-- <div v-for="account in accounts" :key="account.id">
			<router-link :to="{ name: 'PotDetails', params: { id: account.id}}">
				<h2>{{account.name}}</h2>
			</router-link>
			
		</div> -->
	
		</div>
		<div v-else>
			...loading
			<hr>
			maybe there is the need to start json server 
			<br>
			npx json-server data/db/json
		</div>

		<div v-if="logData">
			{{ logData }}
		</div>
	</div>

</template>

<script>

import axios from "axios";

const baseUrl="http://localhost:3000/accounts/";
const baseUrlDos="http://localhost:3000/logs/";

export default {
	data(){
		return {
			accounts: [],
			//calculatedSum: [],
			accountsDos:[],
			logData: [],
			currentTimestamp: {},
			//formattedDateTime: null,
			currentMonth: null,
			year: [],
			digitMonat: null

			}
	},
	methods:{
		async GetApi(){
			await axios
				.get(baseUrl)
				.then(resp=>{
					this.accountsDos = resp.data;
				})
				.catch(err=>{console.log(err)}
				);
		},
		async GetApiLogs(){
			await axios
				.get(baseUrlDos)
				.then(resp=>{
					this.logData = resp.data;
				})
				.catch(err=>{console.log(err)}
				);
			},
		async PlusApi(id, balance, name, einzahlung, active){
			await axios
			.put(baseUrl+id,{balance: balance, name: name, einzahlung:einzahlung, active: active})
			.then(resp=>{
				//console.log(resp);
				// console.log("balance plus:  " + balance);
				// console.log("einzahlung plus:  " + einzahlung);
			//	this.GetApi();
				alert("success: auf Konto " + name + "(" + id + ") wurden " + einzahlung + " Euro eingezahlt!");
				this.GetApi();
			})
			.catch(err=>{console.log(err)});
		},
		//log
		async log(fromId, toId, betrag, betreff){
			const maxId = Math.max(...this.logData.map(item => item.logId));
			await axios
			.post(baseUrlDos,{logId:maxId + 1, fromId: fromId, toId: toId, date: this.currentTimestamp, betrag: betrag, betreff: betreff })
			.then(resp=>{
				console.log(resp);
				this.GetApiLogs();
			})
			.catch(err=>{console.log(err)});
		},

		action2(id){
			console.log(id);
		},
		einzahlen(id, betrag, balance, name, active){
			console.log("Betrag " + betrag + " auf Konto " + id + " überweisen");
			// console.log("NAME: " + name);
			// console.log("alte Summe: " + balance);
			console.log("active: " + active);
			this.summe = Number(balance) + Number(betrag);
			//console.log("neue Summe: " + this.summe);
			this.PlusApi(id, this.summe, name, betrag, active);
			this.log(0, id, betrag, "monatliche Einzahlung: " + this.currentMonth);
		}
	},
	computed:{
		calculatedSum() {
		return this.accountsDos
			.filter(item => item.active)
			.reduce((sum, item) => sum + item.balance, 0);
		}
  	},	
	mounted(){

		document.title = 'Meine Konten'; // Titel neben favicon
		this.GetApi();
		this.GetApiLogs();

		const currentTimestamp = new Date();
			const year = currentTimestamp.getFullYear();
			const month = ('0' + (currentTimestamp.getMonth() + 1)).slice(-2); // Monat von 0 (Januar) bis 11 (Dezember)
			const day = ('0' + currentTimestamp.getDate()).slice(-2);
			const hours = ('0' + currentTimestamp.getHours()).slice(-2);
			const minutes = ('0' + currentTimestamp.getMinutes()).slice(-2);
			const seconds = ('0' + currentTimestamp.getSeconds()).slice(-2);
			this.currentTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

				this.year[1] = "Jänner";
				this.year[2] = "Februar";
				this.year[3] = "März";
				this.year[4] = "April";
				this.year[5] = "Mai";
				this.year[6] = "Juni";
				this.year[7] = "Juli";
				this.year[8] = "August";
				this.year[9] = "September";
				this.year[10] = "Oktober";
				this.year[11] = "November";
				this.year[12] = "Dezember";
			this.currentMonth = this.year[+month]; //+month 4 Str2Int
		

		//this.currentTimestamp = Date.now();

		//Old version netNinja
		// fetch(baseUrl)
		// .then(response => response.json())
		// .then(data => this.accounts = data)
		// .catch(err => console.log(err.message))
	}
}
</script>

<style>

</style>