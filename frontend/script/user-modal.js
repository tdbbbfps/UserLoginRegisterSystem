const UserModal = {
    props: ["showModal", "loading", "message"],
    emits: ["close", "submit", "update-message"],
    data() {
        return {
            isLogin: true,
            username: "",
            name: "",
            password: "",
            email: "",
            confirmPassword: "",
            showPassword: false
        };
    },
    computed: {
        passwordAnalysis() {
            const pwd = this.password || "";
            return {
                length: pwd.length >= 8,
                upper: /[A-Z]/.test(pwd),
                lower: /[a-z]/.test(pwd),
                number: /\d/.test(pwd),
                special: /[\W_]/.test(pwd)
            };
        },
        isPasswordValid() {
            const r = this.passwordAnalysis;
            return r.length && r.upper && r.lower && r.number && r.special;
        },
        isPasswordMatch() {
            return this.password === this.confirmPassword;
        },
        isEmailValid() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(this.email);
        },
        isAllFieldsFilled() {
            if (this.isLogin) {
                return this.username && this.password;
            } else {
                return this.username && this.password && this.confirmPassword && this.email && this.name;
            }
        },
        canConfirm() {
            if (this.isLogin) {
                return this.isAllFieldsFilled;
            } else {
                return this.isAllFieldsFilled && (this.isLogin ? true : this.isPasswordValid && this.isPasswordMatch && this.isEmailValid);
            }
        },
        passwordIconStatus() {
            if (!this.password) {
                return { icon: 'bi bi-question-circle-fill', colorClass: 'icon-default' };
            }
            if (this.isPasswordValid) {
                return { icon: 'bi bi-check-circle-fill', colorClass: 'icon-valid' };
            }
            return { icon: 'bi bi-exclamation-circle-fill', colorClass: 'icon-invalid' };
        },
    },
    watch: {
        confirmPassword() {
            if (!this.password && !this.confirmPassword) {
                this.$emit("update-message", "");
                return;
            }
            if (!this.isPasswordMatch) {
                this.$emit("update-message", "Password doesn't match!");
            } else if (this.isPasswordMatch) {
                this.$emit("update-message", "");
            }
        }
    },
    methods: {
        async confirm() {
            if (this.loading) {
                return;
            }
            // Check if password match confirmPassword.
            if (!this.isLogin) {
                if (!this.isPasswordMatch) {
                    this.$emit("update-message", "Password doesn't match!");
                    return;
                }
                if (!this.isPasswordValid) {
                     this.$emit("update-message", "Password must comply with rules.!");
                    return;
                }
            }
            const payload = {
                type: this.isLogin ? "login" : "register",
                data: {}
            }

            payload.data.username = this.username;
            payload.data.password = this.password;
            if (!this.isLogin) {
                payload.data.email = this.email;
                payload.data.name = this.name;
            }
            // Send payload to app.js.
            this.$emit("submit", payload);
            this.$emit("update-message", this.isLogin ? "Logining in..." : "Registering...");
        },
        switchMode() {
            this.isLogin = !this.isLogin;
            this.clean();
            this.$emit("update-message", "");
        },
        forgetPassword() {
            console.log("I didn't implement this.")
        },
        close() {
            this.clean();
            this.$emit("close");
            this.$emit("update-message", "");
        },
        clean() {
            this.username = "";
            this.name = "";
            this.password = "";
            this.email = "";
            this.confirmPassword = "";
            this.showPassword = false;
        },
    },
    template: `
    <div v-if="showModal" class="user-modal">
        <div class=user-modal-content>
            <button @click="close" class="close-button">&times;</button>
            <h1>{{isLogin ? 'Login' : 'Register'}}</h1>
            <div v-show="!isLogin" class="form-group">
                <label>Email</label>
                <input type="text" v-model="email" placeholder="">
            </div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" placeholder="">
            </div>
            <div v-show="!isLogin" class="form-group">
                <label>Name</label>
                <input type="text" v-model="name" placeholder="">
            </div>
            <div class="form-group">
                <label>Password</label>
                <div class="input-wrapper">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="">
                    <div v-if="!isLogin" class="status-icon">
                        <i :class="[passwordIconStatus.icon, passwordIconStatus.colorClass]"></i>
                        <div class="tooltip-box">
                            <strong>Password Rules:</strong>
                            <ul>
                                <li :style="{color: passwordAnalysis.length ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)'}">{{passwordAnalysis.length ? '&#10004;' : '&#10006;'}} At least 8 characters</li>
                                <li :style="{color: passwordAnalysis.upper ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)'}">{{passwordAnalysis.upper ? '&#10004;' : '&#10006;'}} At least one uppercase (A-Z)</li>
                                <li :style="{color: passwordAnalysis.lower ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)'}">{{passwordAnalysis.lower ? '&#10004;' : '&#10006;'}} At least one lowercase (a-z)</li>
                                <li :style="{color: passwordAnalysis.number ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)'}">{{passwordAnalysis.number ? '&#10004;' : '&#10006;'}} At least one number (0-9)</li>
                                <li :style="{color: passwordAnalysis.special ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)'}">{{passwordAnalysis.special ? '&#10004;' : '&#10006;'}} At least one special char (!@#$etc...)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!isLogin" class="form-group">
                <label>Confirm Password</label>
                <input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="">
            </div>
            <div class="horizontal-container">
                <p>{{message}}</p>
                <button @click="showPassword = !showPassword" class="plain-text-button">
                    <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    {{showPassword ? 'Hide Password' : 'Show Password'}}
                </button>
            </div>
            <div class="form-group">
                <button @click="confirm" class="confirm-button" :disabled="!canConfirm || loading">Confirm</button>
            </div>
            <div class="form-group">
                <button @click="forgetPassword" class="plain-text-button">Forget Password?</button>
            </div>
            <div class="form-group">
                <button @click="switchMode" class="plain-text-button" :disabled="loading">{{isLogin ? 'No account? Register here.' : 'Have an account? Login here.'}}</button>
            </div>
        </div>
    </div>
    `
}