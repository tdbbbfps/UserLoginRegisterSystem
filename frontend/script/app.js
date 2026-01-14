const { createApp, ref, onMounted, reactive } = Vue;

const app = createApp({
    components: {
        "user-modal": UserModal,
        "profile-modal": ProfileModal
    },
    data() {
        return {
            token: localStorage.getItem("access_token"),
            user: null
        };
    },
    setup() {
        const API_URL = "http://localhost:8000/api";
        const token = ref(localStorage.getItem("access_token") || "");
        const showModal = ref(true);
        const loading = ref(false);
        const message = ref("");
        const user = ref("");
        const editForm = reactive({ "email": "", "username": "", "password": "", "name": "", "bio": "" })

        axios.interceptors.request.use(config => {
            if (token.value) {
                config.headers.Authorization = `Bearer ${token.value}`;
            }
            return config;
        });
        const handleSubmit = async (payload) => {
            const { type, data } = payload;
            loading.value = true;
            // message.value = "";
            if (type === "login") {
                await handleLogin(data)
            } else {
                await handleRegister(data)
            }
        };
        // Send login request.
        const handleLogin = async (data) => {
            loading.value = true;
            try {
                const params = new URLSearchParams();
                params.append("username", data.username);
                params.append("password", data.password);

                const response = await axios.post(`${API_URL}/auth/token`, params);

                token.value = response.data.access_token;
                localStorage.setItem("access_token", token.value);

                showModal.value = false;
                message.value = "Login success!";
                await fetchUserProfile();
            } catch (error) {
                console.log(error);
                message.value = "Login failed!";
            } finally {
                loading.value = false;
            }
        };
        // Send register request.
        const handleRegister = async (data) => {
            loading.value = true;
            try {
                await axios.post(`${API_URL}/user/`, data);
                message.value = "Register success!";
            } catch (err) {
                console.log(err);
                message.value = "Register failed!" + (err.response?.data?.detail || "Unknown error.")
            } finally {
                loading.value = false;
            }
        };
        // Get user data.
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/me`);
                user.value = response.data;

                editForm.email = user.value.email;
                editForm.username = user.value.username;
                editForm.name = user.value.name;
                editForm.bio = user.value.bio;
            } catch (err) {
                console.log(err);
            }
        };
        // Send update user data request.
        const updateUserProfile = async (payload) => {
            loading.value = true;
            try {
                const response = await axios.patch(`${API_URL}/user/me`, payload);
                user.value = response.data;
                alert("Update success!");
            } catch (err) {
                console.log(err);
            } finally {
                loading.value = false;
            }
        };
        // Clear user data and jwt.
        const logout = () => {
            token.value = "";
            localStorage.removeItem("access_token");
            user.value = "";
        };
        onMounted(() => {
            if (token.value) {
                fetchUserProfile();
            }
        });
        return {
            // Variables
            token, showModal, loading, message, user, editForm,
            // Functions
            handleSubmit, updateUserProfile, logout
        }
    }
});
app.component("user-modal", UserModal);
app.component("profile-modal", ProfileModal);
app.mount("#app");