const PasswordEditModal = {
    props: ["showModal", "loading", "message"],
    emits: ["close", "submit", "update-message"],
    data() {
        return {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            showPassword: false,
        };
    },
    computed: {
        passwordAnalysis() {
            const pwd = this.newPassword || "";
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
            return this.newPassword === this.confirmNewPassword;
        },
        isPasswordChanged() {
            if (!this.oldPassword && !this.newPassword) return true;
            return this.oldPassword !== this.newPassword;
        },
        canSubmit() {
            return this.oldPassword && this.isPasswordValid && this.isPasswordMatch && this.isPasswordChanged;
        },
        passwordIconStatus() {
            if (!this.newPassword) return { icon: 'bi bi-question-circle-fill', colorClass: 'icon-default' };
            if (this.isPasswordValid) return { icon: 'bi bi-check-circle-fill', colorClass: 'icon-valid' };
            return {icon: 'bi bi-exclamation-circle-fill', colorClass: 'icon-invalid'};
        },
        getMessage() {
            if (this.loading) {
                return "Updating...";
            } else if (!this.isPasswordMatch) {
                return "Password doesn't match!";
            } else if (!this.isPasswordChanged) {
                return "Password hasn't changed!";
            } else {
                return "";
            }
        }
    },
    methods: {
        submit() {
            if (this.loading) return;
            const payload = {
                old_password: this.oldPassword,
                new_password: this.newPassword
            };
            this.$emit("submit", payload);
        },
        close() {
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmNewPassword = "";
            this.$emit("close");
        }
    },
    template: `
    <div v-if="showModal" class="user-modal">
        <div class="user-modal-content" style="z-index: 1000;">
            <button @click="close" class="close-button">&times;</button>
            <h1>Change Password</h1>
            <div class="form-group">
                <label>Old Password</label>
                <input :type="showPassword ? 'text' : 'password'" v-model="oldPassword" placeholder="">
            </div>
            <div class="form-group">
                <label>New Password</label>
                <div class="input-wrapper">
                    <input :type="showPassword ? 'text' : 'password'" v-model="newPassword" placeholder="">
                    <div class="status-icon">
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
            <div class="form-group">
                <label>Confirm New Password</label>
                <input :type="showPassword ? 'text' : 'password'" v-model="confirmNewPassword" placeholder="">
            </div>
            <div class="horizontal-container">
                <p>{{getMessage || message}}</p>
                <button @click="showPassword = !showPassword" class="plain-text-button">
                    <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    {{showPassword ? 'Hide Passwords' : 'Show Passwords'}}
                </button>
            </div>
            <div class="form-group">
                <button @click="submit" class="confirm-button" :disabled="!canSubmit || loading">
                    {{loading ? 'Updating...' : 'Update Password'}}
                </button>
            </div>
        </div>
    </div>
    `
};