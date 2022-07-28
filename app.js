const app = Vue.createApp({
    data () {
        return {
            username: "",
            password: "",
            confirm_password: "",
        }
    },
    methods: {
        goToLogin () {
            console.log("test");
            window.location = "/login.html";
        },
        goToRegister () {
            window.location = "/register.html";
        },
        login () {
            if (this.username == "" || this.password == "") {
                alert("please enter username and password");
            } else {
                // TODO axios
            }
        },
        register () {
            if (this.username == "" || this.password == "" || this.confirm_password == "") {
                alert("please enter username and password");
            } else if (this.password != this.confirm_password) {
                alert("please enter same password");
            } else {
                // TODO axios
            }
        }
    }
});

app.mount("#app");