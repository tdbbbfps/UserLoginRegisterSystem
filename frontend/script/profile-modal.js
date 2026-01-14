const ProfileModal = {
    props: ["loading", "user"],
    emits: ["submit"],
    data() {
        return {
            isEditing: false,

            email: "",
            username: "",
            name: "",
            password: "",
            bio: "",

            showPassword: false,
            message: "",
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
                    this.password = "";
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
                    this.email = newUser.email || "";
                    this.username = newUser.username || "";
                    this.name = newUser.name || "";
                    this.bio = newUser.bio || "";
                    this.password = "";
                }
            }
        },
        async submit() {
            if (loading) {
                console.log("Processing request... Stop trying.")
                return;
            }
            
            const payload = {
                email: this.email,
                username: this.username,
                name: this.name,
                bio: this.bio
            }

            if (this.password && this.password.trim() !== "") {
                payload.password = this.password;
            }
            this.$emit("submit", payload);
            
            this.isEditing = false;
        }
    },
    template: `
    <div class="profile-modal">
        <div class="profile-modal-content">
            <h1>Profile</h1>
            <div class="form-group">
                <label>Email</label>
                <input type="text" v-model="email" placeholder="" :disabled="!isEditing">
            </div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" placeholder="" :disabled="!isEditing">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" v-model="name" placeholder="" :disabled="!isEditing">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="" :disabled="!isEditing">
            </div>
            <div class="form-group">
                <label>Bio</label>
                <textarea v-model="bio" placeholder="" :disabled="!isEditing"></textarea>
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
                <button @click="submit" class="submit-button" :disabled="!isEditing">&#10004; Submit</button>
            </div>
        </div>
    </div>
    `
}