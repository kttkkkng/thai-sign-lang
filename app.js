const app = Vue.createApp({
    data () {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        goToLogin () {
            window.location = "/login.html";
        },
        goToRegister () {
            window.location = "/register.html";
        }
    }
});

app.mount("#app");