const url = "http://localhost:3000";

const app = Vue.createApp({
    data () {
        return {
            username: "",
            password: "",
            confirm_password: "",
            showCamera: true,
        }
    },
    methods: {
        goToLogin () {
            window.location = "/login.html";
        },
        goToRegister () {
            window.location = "/register.html";
        },
        async login () {
            if (this.username == "" || this.password == "") {
                alert("please enter username and password");
            } else {
                let response;
                try {
                    response = await axios.post(url + "/user/login", { username: this.username, password: this.password });
                } catch (err) {
                    if (err.response) {
                        if (err.response.status == "400") {
                            alert(err.response.data.message);
                        } else {
                            console.log(err.response.status);
                        }
                        return;
                    } else {
                        return alert("cannot connect to backend");
                    }
                }
                alert("success");
                $cookies.set("token", response.data.token,  "7d");
            }
        },
        async register () {
            if (this.username == "" || this.password == "" || this.confirm_password == "") {
                alert("please enter username and password");
            } else if (this.password != this.confirm_password) {
                alert("please enter same password");
            } else {
                let response;
                try {
                    response = await axios.post(url + "/user/register", { username: this.username, password: this.password, confirm_password: this.confirm_password });
                } catch (err) {
                    if (err.response) {
                        if (err.response.status == "400") {
                            alert(err.response.data.message);
                        } else {
                            console.log(err.response.status);
                        }
                        return;
                    } else {
                        return alert("cannot connect to backend");
                    }
                }
                alert("success");
            }
        },
        async toggleCamera() {
            this.showCamera = !this.showCamera;

            if (!this.showCamera) {
                let tracks = video.srcObject.getTracks();

                tracks.forEach(track => {
                    track.stop();
                });
            } else {
                navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    video.srcObject = stream;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
    }
});

app.mount("#app");