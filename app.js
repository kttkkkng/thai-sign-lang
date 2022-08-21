const url = "http://localhost:3000";

let question = [];
let current = 1;
let done = false;
let unit = 1;
let answer;

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
        goToUnit () {
            window.location = "/unit.html";
        },
        goToTest (des) {
            unit = des;
            window.location = "/Test.html"
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
                $cookies.set("token", response.data.token,  "7d");

                window.location = "/unit.html";
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

            let video = document.getElementById("camera");

            if (!this.showCamera) {
                let tracks = video.srcObject.getTracks();

                tracks.forEach(track => {
                    track.stop();
                });

                clearInterval(timer);
            } else {
                navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    video.srcObject = stream;
                })
                .catch(error => {
                    console.log(error);
                });

                timer = setInterval(() => {
                    capture();
                }, 200);
            }
        },
        async capture () {
            capture();
        },
        async nextTestQuestion () {
            if (!done) return;
            if (current + 1 < question.length) {
                done = false;

                let response;

                try {
                    response = axios.post(url + "/test/answer", { word_id: question[current].id, answer: answer });
                } catch (err) {

                }

                current++;

                pic.src = `${question[current].id}.jpg`;

                choices.forEach((choice, index) => {
                    choice.textContent = question[current].choice[index];
                });
            } else if (current + 1 == question.length) {
                current++;

                document.getElementById("check").textContent = "เสร็จสิ้น";
            } else if (document.getElementById("check").textContent == "เสร็จสิ้น") {
                window.location = "/unit.html";
            }
        },
    }
});

app.mount("#app");