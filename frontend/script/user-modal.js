const UserModal = {
    props: ["showModal", "message", "loading"],
    emits: ["close", "submit", "update-message"],
    data() {
        return {
            isLogin: true,
            username: "",
            name: "",
            password: "",
            email: "",
            confirmPassword: "",
            showPassword: false,
        };
    },
    computed: {
        isPasswordValid() {
            if (!this.password) return false;
            const rule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            return rule.test(this.password);
        },
        isPasswordMatch() {
            return this.password === this.confirmPassword;
        },
        isAllFieldsFilled() {
            if (this.isLogin) {
                return this.username && this.password;
            } else {
                return this.username && this.password && this.confirmPassword && this.email && this.name;
            }
        }
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
                console.log("Processing request... Stop trying.")
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
            // Update message when login or register.
            if (this.isLogin) {
                this.$emit("update-message", "Logining in...");
            } else {
                this.$emit("update-message", "Registering...");
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
        },
        showRules() {
            alert("Password Rules:\n\n1. At least 8 characters long.\n2. At least one uppercase letter (A-Z).\n3. At least one lowercase letter (a-z).\n4. At least one number (0-9).\n5. At least one special character (!@#$etc.).");
        },
        switch_mode() {
            this.isLogin = !this.isLogin;
            this.clean();
        },
        close() {
            this.clean();
            this.$emit("close");
        },
        clean() {
            this.$emit("update-message", "");
            this.username = "";
            this.name = "";
            this.password = "";
            this.email = "";
            this.confirmPassword = "";
            this.showPassword = false;
        }
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
                <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="">
            </div>
            <div v-show="!isLogin" class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label>Confirm Password</label>
                    <div v-if="password" style="transform: translate(0px, -4px); display: flex; align-items: center; gap: 10px;">
                        <button @click="showRules" class="password-rule-button" :class="isPasswordValid ? 'password-rule-valid-button' : 'password-rule-invalid-button'">
                        {{ isPasswordValid ? '&#10004; Password Valid!' : '&times; Password Invalid!' }}
                        </button>
                    </div>
                </div>
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
                <button @click="confirm" class="confirm-button" :disabled="!isAllFieldsFilled">Confirm</button>
            </div>
            <div class="form-group">
                <button @click="switch_mode" class="plain-text-button">{{isLogin ? 'No account? Register here.' : 'Have an account? Login here.'}}</button>
            </div>
        </div>
    </div>
    `
}