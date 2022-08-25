const url = "http://ec2-175-41-163-195.ap-southeast-1.compute.amazonaws.com:3000";

let question = [];
let words = [];
let current = 0;
let done = false;
let answer;
let lock = false;

let setUnit;
let getUnit;

const app = Vue.createApp({
    created () {
        setUnit = (unit) => {
            this.unit = unit;
            $cookies.set("unit", unit);
        };
        getUnit = () => {
            return $cookies.get("unit");
        };
    },
    mounted () {
        const name = document.getElementById("name");

        if (name) {
            if ($cookies.isKey("name")) {
                document.getElementById("name").textContent = $cookies.get("name");
            }
        }
    },
    data () {
        return {
            username: "",
            password: "",
            confirm_password: "",
            showCamera: true,
            current: 0,
            unit: 1,
        }
    },
    methods: {
        goToIndex () {
            window.location = "/index.html";
        },
        goToLogin () {
            window.location = "/login.html";
        },
        goToRegister () {
            window.location = "/register.html";
        },
        goToUnit () {
            window.location = "/unit.html";
        },
        goToChoiceTest () {
            window.location = "/Test.html";
        },
        goToTest (des) {
            setUnit(des);
            window.location = "/choose_test.html";
        },
        goToLesson (des) {
            setUnit(des);
            window.location = "/Lesson.html";
        },
        goToCameraTest () {
            window.location = "/camera.html";
        },
        goToLibrary () {
            window.location = "/Library.html";
        },
        goToLibrary_Unit1 (){
            window.location = "/Library_Unit1.html";
        },
        goToLibrary_Unit2 (){
            window.location = "/Library_Unit2.html";
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
                $cookies.set("token", response.data.token, "7d");
                $cookies.set("name", response.data.username, "7d");

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
                window.location.href = "/login.html";
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
                }, 700);
            }
        },
        async capture () {
            capture();
        },
        async nextTestQuestion () {
            if (document.getElementById("check").textContent == "เสร็จสิ้น") {
                window.location = "/unit.html";
            }

            if (!done) return;
            
            let response;

            if (current + 1 <= question.length) {
                done = false;
                lock = true;

                try {
                    response = await axios.post(url + "/test/answer", { word_id: question[current].id, ans: choices[answer].textContent }, {
                        headers: {
                            "Authorization": `Bearer ${$cookies.get('token')}`,
                        },
                    });
                } catch (err) {
                    console.log(err);
                }

                if (response.data.is_correct) {
                    choices[answer].style.backgroundColor = '#53b9aeff';
                } else {
                    choices[answer].style.backgroundColor = '#e7581aff';
                    choices.forEach((choice, index) => {
                        if (choice.textContent == response.data.correct) {
                            choices[index].style.backgroundColor = '#53b9aeff';
                        }
                    });
                    await new Promise((r) => setTimeout(r, 2000));
                }

                current++;

                await new Promise((r) => setTimeout(r, 1000));
                
                if (current == question.length) {
                    document.getElementById("check").textContent = "เสร็จสิ้น";
                } else {
                    choices.forEach(choice => {
                        choice.style.backgroundColor = '#f5e6d8ff';
                    });

                    pic.src = `Picture/${question[current].id}.jpg`;
    
                    choices.forEach((choice, index) => {
                        choice.textContent = question[current].choice[index];
                    });

                    lock = false;
                }
            }
        },
        selectAnswer (index) {
            if (!lock) {
                choices.forEach(choice => {
                    choice.style.backgroundColor = '#f5e6d8ff';
                });
                choices[index].style.backgroundColor = '#f8a54aff';
                done = true;
                answer = index;
            }
        },
        async nextWord () {
            if (this.current + 1 == words.length) {
                try {
                    await axios.patch(url + '/unit/track', { now_unit: getUnit() }, {
                        headers: {
                            "Authorization": `Bearer ${$cookies.get('token')}`,
                        },
                    });
                } catch (err) {
                    alert("cannot connect to backend");
                }

                window.location = "/unit.html";
            } else if (this.current + 1 < words.length) {
                this.current++;

                pic.src = `Picture/${words[this.current].id}.jpg`

                word.textContent = words[this.current].word;

                if (this.current + 1 == words.length) {
                    document.getElementById("nextButton").textContent = "เสร็จสิ้น";
                }
            }
        },
        async prevWord () {
            if (this.current - 1 >= 0) {
                this.current--;

                pic.src = `Picture/${words[this.current].id}.jpg`
                document.getElementById("nextButton").textContent = "ถัดไป";
                word.textContent = words[this.current].word;
            }
        },
    }
});

app.mount("#app");