<template>
  <div>
    <v-navigation-drawer
			app
			permanent
			expand-on-hover
			right
		>
			<v-list-item class="px-2" v-if="!$store.state.authUser">
				<v-list-item-avatar>
					<v-img :src="`file:///${__resources}/account.png`"></v-img>
				</v-list-item-avatar>

				<v-list-item-title>Pas connecté</v-list-item-title>

				<v-btn
					icon
					@click.stop="mini = !mini"
				>
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
			</v-list-item>

			<v-list-item class="px-2" v-else>
				<v-list-item-avatar>
					<v-img src="https://cdn.discordapp.com/avatars/556940395473534986/6a0bc85e4504fde7f2e8900821281dc8.png?size=2048"></v-img>
				</v-list-item-avatar>

				<v-list-item-title>{{ $store.state.authUser.username }}</v-list-item-title>

				<v-btn
					icon
					@click.stop="mini = !mini"
				>
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
			</v-list-item>

			<v-divider></v-divider>

			<v-list dense v-if="!$store.state.authUser">
				<v-list-item
					link
				>
					<v-list-item-icon>
						<v-icon>mdi-login</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title @click="dialogLogin = true">Se connecter</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					link
				>
					<v-list-item-icon>
						<v-icon>mdi-account-plus</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title @click="dialogRegister = true">S'inscrire</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-list dense v-else>
				<v-list-item
					link
				>
					<v-list-item-icon>
						<v-icon>mdi-account</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>Mon compte</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item
					link
					v-if="$store.state.authUser.role === 'admin'"
				>
					<v-list-item-icon>
						<v-icon>mdi-view-dashboard</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>Dashboard</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item
					link
				>
					<v-list-item-icon>
						<v-icon>mdi-logout</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title v-on:click="logout()">Se déconnecter</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			</v-navigation-drawer>
			<v-dialog
				v-model="dialogLogin"
				width="500"
			>
				<v-card>
					<v-card-title class="headline">Se connecter</v-card-title>
					<v-divider />
					<v-card-text>
						<v-text-field
							v-model="usernameLogin"
							label="Nom d'utilisateur"
							:rules="[rules.required]"
						></v-text-field>

						<v-text-field
							v-model="passwordLogin"
							:append-icon="showPasswordLogin ? 'mdi-eye' : 'mdi-eye-off'"
							:type="showPasswordLogin ? 'text' : 'password'"
							label="Mot de passe"
							:rules="[rules.required]"
							@click:append="showPasswordLogin = !showPasswordLogin"
						></v-text-field>
						<v-alert :value="alertValueLogin" :type="alertTypeLogin">
							{{ alertMessageLogin }}
						</v-alert>

            <v-checkbox
              v-model="checkboxRememberMe"
              label="Se souvenir de moi"
            ></v-checkbox>
					</v-card-text>

				<v-divider />

				<v-card-actions>
					<v-btn
						text
						v-on:click="login()"
					>
						Se connecter
					</v-btn>
				</v-card-actions>
			</v-card>
			</v-dialog>
			<v-dialog
				v-model="dialogRegister"
				width="500"
			>
				<v-card>
					<v-card-title class="headline">S'inscrire</v-card-title>
					<v-divider />
					<v-card-text>
						<v-text-field
							v-model="emailRegister"
							label="Adresse mail"
							:rules="[rules.required, rules.email]"
						></v-text-field>
						<v-text-field
							v-model="usernameRegister"
							label="Nom d'utilisateur"
							:rules="[rules.required]"
						></v-text-field>

						<v-text-field
							v-model="passwordRegister"
							:append-icon="showPasswordRegister ? 'mdi-eye' : 'mdi-eye-off'"
							:type="showPasswordRegister ? 'text' : 'password'"
							label="Mot de passe"
							:rules="[rules.required]"
							@click:append="showPasswordRegister = !showPasswordRegister"
						></v-text-field>
						<v-text-field
							v-model="passwordConfirmRegister"
							:type="showPasswordRegister ? 'text' : 'password'"
							label="Confirmer le mot de passe"
							:rules="[rules.required, passwordConfirmationRule]"
							@click:append="showPasswordRegister = !showPasswordRegister"
						></v-text-field>
						<v-alert :value="alertValueRegister" :type="alertTypeRegister">
							{{ alertMessageRegister }}
						</v-alert>
					</v-card-text>

				<v-divider />

				<v-card-actions>
					<v-btn
						text
						v-on:click="register()"
					>
						S'inscrire
					</v-btn>
				</v-card-actions>
			</v-card>
			</v-dialog>
			<v-snackbar
				v-model="snackbar"
				:color="snackbarColor"
				top
				right
			>
				{{ snackbarMessage }}
			</v-snackbar>
    </div>
</template>

<script>
export default {
  data: () => ({
    dialogRegister: false,
    emailRegister: null,
    usernameRegister: null,
    passwordRegister: null,
    passwordConfirmRegister: null,
    showPasswordRegister: false,
    dialogRegister: false,
    alertValueRegister: false,
    alertTypeRegister: null,
    alertMessageRegister: null,
    dialogLogin: false,
    usernameLogin: null,
    passwordLogin: null,
    showPasswordLogin: false,
    checkboxRememberMe: false,
    alertValueLogin: false,
    alertTypeLogin: null,
    alertMessageLogin: null,
    rules: {
      required: v => !!v || 'Obligatoire',
      email: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "L'adresse mail n'est pas valide !"
    },
    snackbar: false,
    snackbarColor: "",
    snackbarMessage: ""
  }),
  methods: {
    async login() {
      if (this.usernameLogin && this.passwordLogin) {
        try {
          await this.$store.dispatch('login', {
            username: this.usernameLogin,
            password: this.passwordLogin,
            remember: this.checkboxRememberMe
          })
          this.alertValueLogin = false
          this.dialogLogin = false
          this.snackbar = true,
          this.snackbarColor = "success",
          this.snackbarMessage = "Vous êtes bien connecté !"
        } catch (err) {
          this.alertValueLogin = true
          this.alertTypeLogin = "error"
          this.alertMessageLogin = err
          return;
        }
      } else {
        this.alertValueLogin = true
        this.alertTypeLogin = "error"
        this.alertMessageLogin = "Vous n'avez pas tout rempli !"
        return;
      }
    },
    async register() {
      if (this.emailRegister && this.usernameRegister && this.passwordRegister && this.passwordConfirmRegister) {
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.emailRegister)) {
          if (this.passwordRegister === this.passwordConfirmRegister) {
            try {
              await this.$store.dispatch('register', {
                email: this.emailRegister,
                username: this.usernameRegister,
                password: this.passwordRegister
              })
              this.alertValueRegister = false
              this.dialogRegister = false
              this.snackbar = true,
              this.snackbarColor = "success",
              this.snackbarMessage = "Votre compte a bien été créer !"
            } catch (err) {
              this.alertValueRegister = true
              this.alertTypeRegister = "error"
              this.alertMessageRegister = err
              return;
            }
          } else {
            this.alertValueRegister = true
            this.alertTypeRegister = "error"
            this.alertMessageRegister = "Les mots de passes ne correspondent pas !"
            return;
          }
        } else {
          this.alertValueRegister = true
          this.alertTypeRegister = "error"
          this.alertMessageRegister = "L'adresse mail n'est pas valide !"
          return;
        }
      } else {
        this.alertValueRegister = true
        this.alertTypeRegister = "error"
        this.alertMessageRegister = "Vous n'avez pas tout rempli !"
        return;
      }
    },
    async logout() {
      await this.$store.dispatch('logout')
    }
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.passwordRegister === this.passwordConfirmRegister || "Les mots de passes ne correspondent pas !";
    }
  }
}
</script>