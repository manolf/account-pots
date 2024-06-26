<template>

	<div class="container">
		<div class="row">
			<div v-if="accountsDos" class="col-md-6">

					<div class="form-check form-switch col-4">
						<input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="showOnlyActive">
						<label class="form-check-label" for="flexSwitchCheckDefault">nur aktive Konten anzeigen</label>
					</div>

					<table class="table table-hover">
						<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Konto</th>
							<th scope="col">Balance</th>
							<th scope="col">active</th>
						</tr>
						</thead>
						<tbody>
						<!-- only active
						<tr v-for="account in accountsDos.filter(account => account.active)" :key="account.id"> -->
						<tr v-for="account in filteredAccounts" :key="account.id" @click="handleRowClick(account.id)">
							<th scope="row">{{account.id}}</th>
							<td>{{account.name}}</td>
							<td>{{account.balance}} EUR</td>
							<td v-if="account.active">yes </td>
							<td v-else>no </td>
						</tr>
						</tbody>
						<tfoot>
							<td></td>
							<th>TOTAL</th>
							<th v-if="showOnlyActive"> {{calculatedSumActive}} EUR</th>
							<th v-else>{{calculatedSum}} EUR</th>
						</tfoot>
					</table>
			
			</div>

			<div v-else class="col-md-6">
				...loading
				<hr>
				maybe there is the need to start json server 
				<br>
				npx json-server data/db/json
			</div>

			<div class="my-3 col-md-6">
				<h3>Single Konto</h3>
				<!-- Conditionally render potDetails component if accountId is set -->
				<!-- <potDetails v-if="selectedAccountId !== null" :id="selectedAccountId"></potDetails> -->
				<potDetails v-if="selectedAccountId !== null" :id="Number(selectedAccountId)"></potDetails>
			
			</div>


		</div>
	</div>

</template>

<script>

import axios from "axios";
import PotDetails from '../views/Pots/PotDetails.vue';

const baseUrl="http://localhost:3000/accounts/";
const baseUrlDos="http://localhost:3000/logs/";

export default {
  components: { PotDetails },
	data(){
		return {
			accountsDos:[],
			showOnlyActive: false,
			selectedAccountId : null
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
		handleRowClick(accountId) {
      	//	alert(`Clicked on account: ${account.name}`);
			// console.log(account);
			// this.id = account.id;
			this.selectedAccountId = accountId;
			console.log("id: " + accountId);
			console.log(this.selectedAccountId);
		}
	},
	computed:{
		calculatedSum() {
			return this.accountsDos
				.reduce((sum, item) => sum + item.balance, 0);
			},
		calculatedSumActive() {
			return this.accountsDos
				.filter(item => item.active)
				.reduce((sum, item) => sum + item.balance, 0);
			},
		filteredAccounts() {
			if (this.showOnlyActive) {
				return this.accountsDos.filter(account => account.active);
			}
			return this.accountsDos;
			}
  	},	
	mounted(){

		document.title = 'Meine Konten'; // Titel neben favicon
		this.GetApi();
		
	}
}
</script>

<style>

</style>