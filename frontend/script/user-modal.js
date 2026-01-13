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
    methods: {
        async confirm() {
            if (this.loading) {
                console.log("Processing request... Stop trying.")
                return;
            }
            this.$emit("update-message", "");
            
            // Check if password match confirmPassword.
            if (!this.isLogin && this.password !== this.confirmPassword) {
                this.$emit("update-message", "Password doesn't match!")
                return;
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
                <button @click="confirm" class="confirm-button">Confirm</button>
            </div>
            <div class="form-group">
                <button @click="switch_mode" class="plain-text-button">{{isLogin ? 'No account? Register here.' : 'Have an account? Login here.'}}</button>
            </div>
        </div>
    </div>
    `
}