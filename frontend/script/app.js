const { createApp, ref, onMounted, reactive } = Vue;

const app = createApp({
    setup() {
        const API_URL = "http://localhost:8000/api";
        const token = ref(localStorage.getItem("access_token") || "");
        const currentTab = ref("login");
        const loading = ref(false);
        const errorMessage = ref("");
        const successMessage = ref("");

        const user = ref("");
        
        const loginForm = reactive({"username": "", "password": ""});
        const registerForm = reactive({"email": "", "username": "", "password": "", "name": ""});
        const editForm = reactive({"email": "", "username": "", "password": "", "name": "", "bio": ""})
        
        axios.interceptors.request.use(config => {
            if (token.value) {
                config.headers.Authorization = `Bearer ${token.value}`;
            }
            return config;
        });
        // Send login request.
        const handleLogin = async () => {
            loading.value = true;
            errorMessage.value = "";
            try {
                const params = new URLSearchParams();
                params.append("username", loginForm.username);
                params.append("password", loginForm.password);

                const response = await axios.post(`${API_URL}/auth/token`, params);

                token.value = response.data.access_token;
                localStorage.setItem("access_token", token.value);

                await fetchUserProfile();
            } catch (error) {
                console.log(error);
                errorMessage.value = "Login failed!";
            } finally {
                loading.value = false;
            }
        };
        // Send register request.
        const handleRegister = async () => {
            loading.value = true;
            errorMessage.value = "";
            try {
                await axios.post(`${API_URL}/user/`, registerForm);
                alert("Register success!")
                currentTab = "login";
                Object.keys(registerForm).forEach(key => registerForm[key] = "");
            } catch (err) {
                console.log(err);
                errorMessage.value = "Register failed!";
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
        const updateUserProfile = async () => {
            loading.value = true;
            errorMessage.value = "";
            successMessage.value = "";
            try {
                const response = await axios.patch(`${API_URL}/user`, editForm);
                user.value = response.value;
                successMessage.value = "Update success!";
            } catch (err) {
                console.log(err);
                errorMessage.value = "Update failed!";
            } finally {
                loading.value = false;
            }
        };
        // Clear user data and jwt.
        const logout = () => {
            token.value = "";
            localStorage.removeItem("access_token");
            user.value = "";
            currentTab = "login";
        };
        onMounted(() => {
            if (token.value) {
                fetchUserProfile();
            }
        });
        return {
            token, currentTab, loading, errorMessage, successMessage, user, loginForm, registerForm, editForm,
             handleLogin, handleRegister, fetchUserProfile, updateUserProfile, logout
        }

        }


});

app.component('user-modal', UserModal);
app.mount('#app');