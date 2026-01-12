const UserModal = {
    props: ['show_modal'],
    data() {
        return {
            is_login: true,
            username: '',
            name: '',
            password: '',
            email: '',
            confirm_password: '',
            show_password: false,
            hint: ''
        };
    },
    methods: {
        async confirm() {
        },
        close() {
            this.$emit('close');
        }
    },
    template: `
    <div v-if="show_modal" class="user-modal">
        <div class=user-modal-content>
            <button @click="close" class="close-button">&times;</button>
            <h1>{{is_login ? 'Login' : 'Register'}}</h1>
            <div v-show="!is_login" class="form-group">
                <label>Email</label>
                <input type="text" v-model="email">
            </div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username">
            </div>
            <div v-show="!is_login" class="form-group">
                <label>Name</label>
                <input type="text" v-model="name">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" v-model="password">
            </div>
            <div v-show="!is_login" class="form-group">
                <label>Confirm Password</label>
                <input type="password" v-model="confirm_password">
            </div>
            <div class="hint-group">
                <p>{{hint}}</p>
                <button @click="show_password = !show_password" class="switch-button">{{show_password ? 'Hide Password' : 'Show Password'}}</button>
            </div>
            <div class="form-group">
                <button @click="confirm" class="confirm-button">Confirm</button>
            </div>
            <div class="form-group">
                <button @click="is_login = !is_login" class="switch-button">{{is_login ? 'No account? Register here.' : 'Have an account? Login here.'}}</button>
            </div>
        </div>
    </div>
    `
}