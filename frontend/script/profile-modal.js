const ProfileModal = {
    props: [""],
    data() {
        return {
            isEditing: false,
            email: "",
            username: "",
            name: "",
            password: "",
            bio: "",
            showPassword: false,
            message: ""
        }
    },
    methods: {
        toggleEdit() {
            this.isEditing = !this.isEditing;
            if (this.isEditing) {
                // Copy temp data.
            } else {
                // Recover data from temp if cancel.
            }
        },
        submit() {

        }
    },
    template: `
    <div class="profile-modal">
        <div class="profile-modal-content">
            <h1>Profile</h1>
            <div class="form-group">
                <label>Email</label>
                <input type="text" v-model="email" placeholder="">
            </div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" placeholder="">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" v-model="name" placeholder="">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="">
            </div>
            <div class="form-group">
                <label>Bio</label>
                <textarea v-model="bio" placeholder=""></textarea>
            </div>
            <div class="horizontal-container">
                <p>{{message}}</p>
                <button @click="showPassword = !showPassword" class="plain-text-button">
                    <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    {{showPassword ? 'Hide Password' : 'Show Password'}}
                </button>
            </div>
            <div class="horizontal-container">
                <button @click="toggleEdit" class="edit-button" :class="{ 'active': isEditing }">
                    <i :class="isEditing ? '' : 'bi bi-pencil-square'"></i>
                    {{isEditing ? "&times; Cancel" : "Edit"}}
                </button>
                <button @click="submit" class="submit-button">&#10004; Submit
                </button>
            </div>
        </div>
    </div>
    `
}