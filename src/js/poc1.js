class UserLogic {
    async addUser(userData) {
        try {
            const response = await fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            return response.json();
        } catch (error) {
            console.error("Error adding user:", error);
            throw error; 
        }
    }

    async getUserById(userId) {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`);
            if (!response.ok) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            return response.json();
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    async updateUser(userId, updatedData) {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            return response.json();
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
}

class UserUI {
    collectFormData(formId) {
        const formData = new FormData(formId);
        return Object.fromEntries(formData.entries());
    }

    renderResponse(data) {
        console.log('Response:', JSON.stringify(data, null, 2));
    }

    toggleModal(show) {
        const modify = document.querySelector(".modify-content");
        const main = document.querySelector("main");

        modify.classList.toggle("active", show);
        main.classList.toggle("dimmed", show);
    }

    populateForm(userData) {
        const form = document.getElementById('user-form');

        for (const [key, value] of Object.entries(userData)) {
            const input = form.querySelector(`[name="${key}"]`);

            if (input) {
                if (input.type === 'date') {
                    const formattedDate = new Date(value).toISOString().split('T')[0];
                    input.value = formattedDate;
                } else if (input.tagName === 'SELECT') {
                    input.value = value;
                } else {
                    input.value = value || '';
                }
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const submit = document.getElementById("user-form");
    const errormsg = document.querySelector(".error-msg");
    const formHeading = document.getElementById('form-heading');
    const modifyBtn = document.getElementById("edit-user-btn");
    const closeBtn = document.getElementById("close-btn");
    const fetchBtn = document.getElementById("fetch-user-btn");
    const addBtn = document.getElementById("add-user-btn");
    const userLogic = new UserLogic();
    const userUI = new UserUI();

   
    modifyBtn.addEventListener("click", () => {
        userUI.toggleModal(true);
    });

    closeBtn.addEventListener("click", () => {
        userUI.toggleModal(false);
    });

    fetchBtn.addEventListener("click", async () => {
        errormsg.textContent = "";
        const userId = document.getElementById('user-id').value;
        try {
            const user = await userLogic.getUserById(userId);
            userUI.populateForm(user);
            formHeading.textContent = 'Modify User';
            userUI.toggleModal(false);
        } catch (error) {
            errormsg.textContent = error.message;
            userUI.toggleModal(false);
        }
    });

    submit.addEventListener("submit", async (event) => {
        event.preventDefault();
        errormsg.textContent = "";

        const formID = document.getElementById("user-form");
        const userData = userUI.collectFormData(formID);
        console.log("User data collected:", userData);

        const userId = document.getElementById("user-id").value;

        try {
            if (userId) {
                const updatedUser = await userLogic.updateUser(userId, userData);
                userUI.renderResponse(updatedUser);
                submit.reset();
                errormsg.textContent = "User Updated Successfully!";
            } else {
                const addedUser = await userLogic.addUser(userData); 
                userUI.renderResponse(addedUser);
                submit.reset();
                errormsg.textContent = "User Added Successfully!";
            }
        } catch (error) {
            errormsg.textContent = error.message;
        }
    });

    addBtn.addEventListener("click", () => {
        submit.reset();
        formHeading.textContent = 'Add User';
        document.getElementById("user-id").value = "";
        errormsg.textContent = "";
    });
});
