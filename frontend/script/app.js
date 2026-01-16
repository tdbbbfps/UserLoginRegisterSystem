const { createApp, ref, onMounted, reactive } = Vue;

const app = createApp({
    components: {
        "user-modal": UserModal,
        "profile-modal": ProfileModal,
        "password-edit-modal": PasswordEditModal
    },
    setup() {
        const token = ref(sessionStorage.getItem("access_token") || "");
        const user = ref(null);
        const userModal = ref(null);
        const API_URL = "http://localhost:8000/api";
        const showModal = ref(true);
        const showPasswordModal = ref(false);
        const loading = ref(false);
        const message = ref("");

        axios.interceptors.request.use(config => {
            if (token.value) {
                config.headers.Authorization = `Bearer ${token.value}`;
            }
            return config;
        });
        const handleSubmit = async (payload) => {
            const { type, data } = payload;
            loading.value = true;
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
                sessionStorage.setItem("access_token", token.value);

                showModal.value = false;
                await fetchUserProfile();
                message.value = "";
            } catch (err) {
                message.value = "Login failed! " + (err.response?.data?.detail || "Unknown error.");
            } finally {
                loading.value = false;
            }
        };
        // Send register request.
        const handleRegister = async (data) => {
            loading.value = true;
            try {
                await axios.post(`${API_URL}/user/`, data);
                message.value = "Register success! Please login.";
                if (userModal.value) {
                    userModal.value.switchToLogin();
                }
            } catch (err) {
                message.value = "Register failed! " + (err.response?.data?.detail || "Unknown error.");
            } finally {
                loading.value = false;
            }
        };
        // Get user data.
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/me`);
                user.value = response.data;
            } catch (err) {
                console.log(err)
            }
        };
        // Send update user data request.
        const updateUserProfile = async (payload) => {
            loading.value = true;
            try {
                const response = await axios.patch(`${API_URL}/user/me`, payload);
                user.value = response.data;
                message.value = "Update success!";
            } catch (err) {
                message.value = "Update failed! " + (err.response?.data?.detail || "Unknown error.");
            } finally {
                loading.value = false;
            }
        };
        const handleChangePassword = async (payload) => {
            loading.value = true;
            try {
                await axios.post(`${API_URL}/user/me/password`, payload);
                
                message.value = "Password changed successfully! Please login again.";

                logout(); 
                showPasswordModal.value = false;
                
            } catch (err) {
                message.value = "Password change failed! " + (err.response?.data?.detail || "Unknown error.");
            } finally {
                loading.value = false;
            }
        };
        // Clear user data and jwt.
        const logout = () => {
            token.value = "";
            sessionStorage.removeItem("access_token");
            user.value = null;
        };

        const handleUpdateMessage = (msg) => {
            message.value = msg;
        };

        onMounted(() => {
            if (token.value) {
                fetchUserProfile();
            }
        });
        return {
            token, showModal, loading, user, showPasswordModal, message, userModal,
            handleSubmit, updateUserProfile, handleChangePassword, logout, handleUpdateMessage
        }
    }
});
app.component("user-modal", UserModal);
app.component("profile-modal", ProfileModal);
app.component("password-edit-modal", PasswordEditModal);
app.mount("#app");