const ProfileModal = {
    props: ["loading", "user", "message"],
    emits: ["submit", "edit-password", "login", "logout", "update-message"],
    data() {
        return {
            isEditing: false,

            email: "",
            username: "",
            name: "",
            bio: "",

            showPassword: false,
        }
    },
    watch: {
        user: {
            handler(newUser) {
                if (newUser) {
                    this.email = newUser.email || "";
                    this.username = newUser.username || "";
                    this.name = newUser.name || "";
                    this.bio = newUser.bio || "";
                } else {
                    this.email = "";
                    this.username = "";
                    this.name = "";
                    this.bio = "";
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        toggleEdit() {
            this.isEditing = !this.isEditing;
            // Recover original user data if cancel.
            if (!this.isEditing) {
                if (this.user) {
                    this.email = this.user.email || "";
                    this.username = this.user.username || "";
                    this.name = this.user.name || "";
                    this.bio = this.user.bio || "";
                }
            }
        },
        async submit() {
            if (this.loading) {
                console.log("Processing request... Stop trying.")
                return;
            }

            const payload = {
                name: this.name,
                bio: this.bio
            }

            this.$emit("submit", payload);
            this.isEditing = false;
        }
    },
    template: `
    <div class="profile-modal">
        <div class="profile-modal-content">
            <h1>Profile</h1>
            <div class="horizontal-container" style="display: flex;justify-content: center;align-items: center;">
                <button v-show="!this.user" class="confirm-button" @click="$emit('login')" :disabled="this.user">Login</button>
                <button v-show="this.user" class="confirm-button" @click="$emit('logout')" :disabled="!this.user">Logout</button>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="text" v-model="email" placeholder="" disabled="true">
            </div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" placeholder="" disabled="true">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" v-model="name" placeholder="" :disabled="!isEditing">
            </div>
            <div class="form-group">
                <label>Bio</label>
                <textarea v-model="bio" placeholder="" :disabled="!isEditing"></textarea>
            </div>
            <div class="form-group" style="display: flex;justify-content: center;align-items: center;margin-top: 24px">
                <button @click="$emit('edit-password')" class="edit-button" style="width: 100%;" :disabled="!this.user || loading"><i class="bi bi-pencil-square"></i>Edit Password</button>
            </div>
            <div class="horizontal-container">
                <button @click="toggleEdit" class="edit-button" :class="{ 'active': isEditing }" :disabled="!this.user || loading">
                    <i :class="isEditing ? '' : 'bi bi-pencil-square'"></i>
                    {{isEditing ? "&times; Cancel" : "Edit Profile"}}
                </button>
                <button @click="submit" class="submit-button" :disabled="!isEditing || loading">&#10004; Submit</button>
            </div>
        </div>
    </div>
    `
}