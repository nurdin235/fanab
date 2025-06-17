// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Local Storage Initialization ---
    function loadInitialData() {
        // Only load if data doesn't exist in local storage
        if (!localStorage.getItem('schools')) {
            localStorage.setItem('schools', JSON.stringify(SCHOOL_DATA));
        }
        if (!localStorage.getItem('students')) {
            localStorage.setItem('students', JSON.stringify(INITIAL_STUDENTS));
        }
        if (!localStorage.getItem('lecturers')) {
            localStorage.setItem('lecturers', JSON.stringify(INITIAL_LECTURERS));
        }
        if (!localStorage.getItem('admins')) {
            localStorage.setItem('admins', JSON.stringify(INITIAL_ADMINS));
        }
        if (!localStorage.getItem('courses')) {
            localStorage.setItem('courses', JSON.stringify(INITIAL_COURSES));
        }
        if (!localStorage.getItem('events')) {
            localStorage.setItem('events', JSON.stringify(INITIAL_EVENTS));
        }

        console.log("Initial data loaded/checked in Local Storage.");
        // console.log("Students:", JSON.parse(localStorage.getItem('students')));
        // console.log("Lecturers:", JSON.parse(localStorage.getItem('lecturers')));
    }

    loadInitialData(); // Call this function on page load

    // --- Mobile Navigation Toggle ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');

    if (hamburgerMenu && navList) {
        hamburgerMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburgerMenu.querySelector('i').classList.toggle('fa-bars');
            hamburgerMenu.querySelector('i').classList.toggle('fa-times');
        });
    }










    

    // You can add more global JavaScript functions here
    // e.g., for routing, common utility functions, etc.
});

// Helper function to get data from local storage
function getLocalStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Helper function to set data to local storage
function setLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}




// js/app.js (Add this inside the existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for loadInitialData and hamburger menu) ...

    // --- Registration Page Logic ---
    const registrationForm = document.getElementById('registrationForm');
    const academicYearSelect = document.getElementById('academicYear');
    const programTypeSelect = document.getElementById('programType');
    const schoolSelect = document.getElementById('school');
    const fieldSelect = document.getElementById('field');
    const degreeRequirementsDiv = document.getElementById('degreeRequirements');
    const previousDiplomaCertificateInput = document.getElementById('previousDiplomaCertificate');

    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const matriculeDisplay = document.getElementById('matriculeDisplay');
    const errorList = document.getElementById('errorList');
    const modalLoginBtn = document.getElementById('modalLoginBtn');

    // Helper to close modals
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            successModal.style.display = 'none';
            errorModal.style.display = 'none';
        });
    });

    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == successModal) {
            successModal.style.display = 'none';
        }
        if (event.target == errorModal) {
            errorModal.style.display = 'none';
        }
    });

    if (registrationForm) { // Ensure we are on the registration page
        // Populate Academic Year
        function populateAcademicYears() {
            const currentYear = new Date().getFullYear();
            for (let i = currentYear; i <= currentYear + 5; i++) { // Next 5 years
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `${i}/${i + 1}`;
                academicYearSelect.appendChild(option);
            }
        }
        populateAcademicYears();

        // Populate Schools
        function populateSchools() {
            const schools = getLocalStorageData('schools');
            for (const schoolName in schools) {
                const option = document.createElement('option');
                option.value = schoolName;
                option.textContent = schoolName;
                schoolSelect.appendChild(option);
            }
        }
        populateSchools();

        // Dynamic Field of Study Update
        schoolSelect.addEventListener('change', () => {
            const selectedSchool = schoolSelect.value;
            const schools = getLocalStorageData('schools');
            const fields = schools[selectedSchool] || [];

            fieldSelect.innerHTML = '<option value="">Select Field of Study</option>';
            if (fields.length > 0) {
                fields.forEach(field => {
                    const option = document.createElement('option');
                    option.value = field;
                    option.textContent = field;
                    fieldSelect.appendChild(option);
                });
                fieldSelect.disabled = false;
            } else {
                fieldSelect.disabled = true;
            }
        });

        // Program Type dependent fields (Degree -> Previous Diploma)
        programTypeSelect.addEventListener('change', () => {
            if (programTypeSelect.value === 'Degree') {
                degreeRequirementsDiv.classList.remove('hidden');
                previousDiplomaCertificateInput.setAttribute('required', 'required');
            } else {
                degreeRequirementsDiv.classList.add('hidden');
                previousDiplomaCertificateInput.removeAttribute('required');
            }
        });

        // --- Form Validation and Submission ---
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            clearErrors(); // Clear previous errors

            const formData = new FormData(registrationForm);
            const studentData = {};
            let isValid = true;
            const errors = [];

            // Collect data and perform basic validation
            formData.forEach((value, key) => {
                studentData[key] = value.trim();
                const inputElement = registrationForm.querySelector(`[name="${key}"]`);
                const errorDiv = inputElement ? inputElement.nextElementSibling : null; // Get the .error-message div

                if (inputElement && inputElement.hasAttribute('required') && value.trim() === '') {
                    isValid = false;
                    displayError(inputElement, `${formatLabel(key)} is required.`);
                    errors.push(`${formatLabel(key)} is required.`);
                } else {
                    // Specific validations
                    if (key === 'email' && value.trim() !== '' && !isValidEmail(value.trim())) {
                        isValid = false;
                        displayError(inputElement, `Please enter a valid email address.`);
                        errors.push(`Invalid email format.`);
                    }
                    if (key === 'phone' && value.trim() !== '' && !isValidPhone(value.trim())) {
                        isValid = false;
                        displayError(inputElement, `Please enter a valid Cameroonian phone number (e.g., +2376xxxxxxxx).`);
                        errors.push(`Invalid phone format.`);
                    }
                    if (key === 'dob' && value.trim() !== '' && new Date(value) >= new Date()) {
                        isValid = false;
                        displayError(inputElement, `Date of Birth cannot be in the future.`);
                        errors.push(`Invalid Date of Birth.`);
                    }
                    if (key === 'gender' && !studentData['gender']) {
                         // Check for radio buttons manually
                        const radioGroup = registrationForm.querySelector('.radio-group');
                        const genderErrorDiv = radioGroup.nextElementSibling;
                        if(genderErrorDiv) {
                            genderErrorDiv.textContent = 'Gender is required.';
                            genderErrorDiv.style.display = 'block';
                            radioGroup.closest('.form-group').classList.add('error');
                            isValid = false;
                            errors.push(`Gender is required.`);
                        }
                    }
                }
            });

            // Ensure radio buttons are checked
            if (!document.querySelector('input[name="gender"]:checked')) {
                const genderGroup = document.querySelector('.radio-group');
                const genderErrorDiv = genderGroup.nextElementSibling;
                if(genderErrorDiv) {
                    genderErrorDiv.textContent = 'Gender is required.';
                    genderErrorDiv.style.display = 'block';
                    genderGroup.closest('.form-group').classList.add('error');
                }
                isValid = false;
                errors.push('Gender is required.');
            }


            if (!isValid) {
                showErrorModal(errors);
                return;
            }

            // Generate Matricule Number
            const existingStudents = getLocalStorageData('students');
            const newMatricule = generateMatricule(studentData.programType, existingStudents.length + 1);
            studentData.matricule = newMatricule;
            studentData.password = newMatricule; // Initial password is the matricule
            studentData.approved = false; // By default, applications need admin approval
            studentData.results = {}; // Initialize empty results object

            // Save to Local Storage
            existingStudents.push(studentData);
            setLocalStorageData('students', existingStudents);

            // Display Success Modal
            matriculeDisplay.textContent = newMatricule;
            successModal.style.display = 'flex';

            // Auto-redirect or allow user to click
            modalLoginBtn.onclick = () => {
                successModal.style.display = 'none';
                window.location.href = 'login.html'; // Redirect to login page
            };

            // Optional: Auto-redirect after a few seconds
            // setTimeout(() => {
            //     successModal.style.display = 'none';
            //     window.location.href = 'login.html';
            // }, 5000); // Redirect after 5 seconds

            registrationForm.reset(); // Clear the form
            fieldSelect.disabled = true; // Reset field dropdown
            degreeRequirementsDiv.classList.add('hidden'); // Hide degree fields
            previousDiplomaCertificateInput.removeAttribute('required'); // Remove required
        });

        // --- Validation Helper Functions ---
        function displayError(inputElement, message) {
            const formGroup = inputElement.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('error');
                const errorMessageDiv = formGroup.querySelector('.error-message');
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = message;
                }
            }
        }

        function clearErrors() {
            document.querySelectorAll('.form-group.error').forEach(formGroup => {
                formGroup.classList.remove('error');
                const errorMessageDiv = formGroup.querySelector('.error-message');
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = '';
                }
            });
            errorList.innerHTML = ''; // Clear error list in modal
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function isValidPhone(phone) {
             // Basic Cameroonian phone number validation: starts with +237 followed by 9 digits
            return /^\+237[0-9]{9}$/.test(phone);
        }

        function formatLabel(key) {
            // Convert camelCase to Title Case for display
            return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        }

        function showErrorModal(errors) {
            errorList.innerHTML = '';
            errors.forEach(err => {
                const li = document.createElement('li');
                li.textContent = err;
                errorList.appendChild(li);
            });
            errorModal.style.display = 'flex';
        }

        // --- Matricule Generation ---
        function generateMatricule(programType, studentCount) {
            const year = new Date().getFullYear();
            const paddedCount = String(studentCount).padStart(3, '0'); // e.g., 1 -> 001, 10 -> 010
            const programCode = programType === 'HND' ? 'HND' : 'DEG';
            return `FONAB/${programCode}/${paddedCount}/${year}`;
        }
    }
});






// js/app.js (Add this inside the existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for loadInitialData, hamburger menu, registration logic) ...

    // --- Login Page Logic ---
    const loginForm = document.getElementById('loginForm');

    if (loginForm) { // Ensure we are on the login page
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const userTypeRadios = document.querySelectorAll('input[name="userType"]');
        const generalErrorDiv = document.getElementById('generalError');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Clear previous errors
            clearLoginErrors();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            let userType = '';

            for (const radio of userTypeRadios) {
                if (radio.checked) {
                    userType = radio.value;
                    break;
                }
            }

            if (!username || !password || !userType) {
                displayGeneralError("Please enter your credentials and select a user type.");
                return;
            }

            let isAuthenticated = false;
            let loggedInUser = null;
            let redirectPage = '';

            switch (userType) {
                case 'student':
                    const students = getLocalStorageData('students');
                    loggedInUser = students.find(student =>
                        student.fullName.toLowerCase() === username.toLowerCase() && student.password === password
                    );
                    if (loggedInUser && loggedInUser.approved) {
                        isAuthenticated = true;
                        redirectPage = 'student-dashboard.html';
                    } else if (loggedInUser && !loggedInUser.approved) {
                        displayGeneralError("Your student registration is pending approval. Please contact administration.");
                        return;
                    }
                    break;
                case 'lecturer':
                    const lecturers = getLocalStorageData('lecturers');
                    loggedInUser = lecturers.find(lecturer =>
                        lecturer.id.toLowerCase() === username.toLowerCase() && lecturer.password === password
                    );
                    if (loggedInUser) {
                        isAuthenticated = true;
                        redirectPage = 'lecturer-panel.html';
                    }
                    break;
                case 'admin':
                    const admins = getLocalStorageData('admins');
                    loggedInUser = admins.find(admin =>
                        admin.username.toLowerCase() === username.toLowerCase() && admin.password === password
                    );
                    if (loggedInUser) {
                        isAuthenticated = true;
                        redirectPage = 'admin-dashboard.html';
                    }
                    break;
            }

            if (isAuthenticated && loggedInUser) {
                // Store logged-in user info in sessionStorage
                sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                sessionStorage.setItem('userType', userType);
                window.location.href = redirectPage;
            } else {
                displayGeneralError("Invalid username/ID or password. Please try again.");
            }
        });

        function displayGeneralError(message) {
            generalErrorDiv.textContent = message;
            generalErrorDiv.style.display = 'block';
        }

        function clearLoginErrors() {
            generalErrorDiv.textContent = '';
            generalErrorDiv.style.display = 'none';
            // Also clear specific field errors if any were added
        }
    }

    // Helper functions (already in app.js, just for context)
    // function getLocalStorageData(key) { ... }
    // function setLocalStorageData(key, data) { ... }
});











// js/app.js (Add this inside the existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for loadInitialData, hamburger menu, registration logic, login logic) ...

    // --- Student Dashboard Logic ---
    const welcomeMessage = document.getElementById('welcomeMessage');
    const profileName = document.getElementById('profileName');
    const profileMatricule = document.getElementById('profileMatricule');
    const profileProgram = document.getElementById('profileProgram');
    const profileSchool = document.getElementById('profileSchool');
    const profileField = document.getElementById('profileField');
    const profileAcademicYear = document.getElementById('profileAcademicYear');
    const courseList = document.getElementById('courseList');
    const resultsTableContainer = document.getElementById('resultsTableContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    // Function to check login status and redirect if not logged in
    function checkLoginStatus() {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        const userType = sessionStorage.getItem('userType');

        if (!loggedInUser || userType !== 'student') {
            // Not a logged-in student, redirect to login page
            window.location.href = 'login.html';
        }
        return JSON.parse(loggedInUser);
    }

    if (welcomeMessage && profileName) { // Check if elements exist (meaning we're on student-dashboard.html)
        const student = checkLoginStatus(); // Get logged-in student data, or redirect

        if (student) {
            // Populate Profile Card
            welcomeMessage.textContent = `Welcome, ${student.fullName.split(' ')[0]}!`; // Just first name
            profileName.textContent = student.fullName;
            profileMatricule.textContent = student.matricule;
            profileProgram.textContent = student.programType;
            profileSchool.textContent = student.school;
            profileField.textContent = student.field;
            profileAcademicYear.textContent = student.academicYear ? `${student.academicYear}/${parseInt(student.academicYear) + 1}` : 'N/A';

            // Populate Registered Courses
            function displayCourses() {
                const allCourses = getLocalStorageData('courses');
                const studentCourses = allCourses.filter(course =>
                    course.school === student.school && course.field === student.field
                );

                if (studentCourses.length > 0) {
                    courseList.innerHTML = ''; // Clear "Loading courses..."
                    studentCourses.forEach(course => {
                        const lecturer = getLocalStorageData('lecturers').find(l => l.id === course.lecturerId);
                        const lecturerName = lecturer ? lecturer.name : 'Not Assigned';
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<i class="fas fa-angle-right"></i> ${course.name} <br> <small>Lecturer: ${lecturerName}</small>`;
                        courseList.appendChild(listItem);
                    });
                } else {
                    courseList.innerHTML = '<li>No courses registered for your selected program yet.</li>';
                }
            }
            displayCourses();

            // Populate Published Results
            function displayResults() {
                const results = student.results || {}; // Get results from student object
                const resultKeys = Object.keys(results);

                if (resultKeys.length > 0) {
                    let resultsTableHTML = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    resultKeys.forEach(courseId => {
                        const score = results[courseId];
                        const courseName = getLocalStorageData('courses').find(c => c.id === courseId)?.name || courseId;
                        let grade = '';
                        // Simple grading system (example)
                        if (score >= 70) grade = 'A';
                        else if (score >= 60) grade = 'B';
                        else if (score >= 50) grade = 'C';
                        else if (score >= 40) grade = 'D';
                        else grade = 'F';

                        resultsTableHTML += `
                            <tr>
                                <td>${courseName}</td>
                                <td>${score}</td>
                                <td>${grade}</td>
                            </tr>
                        `;
                    });
                    resultsTableHTML += `
                            </tbody>
                        </table>
                    `;
                    resultsTableContainer.innerHTML = resultsTableHTML;
                } else {
                    resultsTableContainer.innerHTML = '<p class="no-results">No results published yet.</p>';
                }
            }
            displayResults();
        }
    }

    // --- Logout Functionality ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            sessionStorage.removeItem('loggedInUser');
            sessionStorage.removeItem('userType');
            window.location.href = 'login.html'; // Redirect to login page
        });
    }

    // Helper functions (already in app.js, just for context)
    // function getLocalStorageData(key) { ... }
    // function setLocalStorageData(key, data) { ... }
});











// js/app.js (Add this inside the existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for loadInitialData, hamburger menu, registration logic, login logic, student dashboard logic) ...

    // --- Admin Dashboard Logic ---
    const adminWelcomeMessage = document.getElementById('adminWelcomeMessage');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const adminNavTabs = document.querySelectorAll('.admin-nav-tabs a');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');

    const studentTableContainer = document.getElementById('studentTableContainer');
    const studentFilterSchool = document.getElementById('studentFilterSchool');
    const studentFilterStatus = document.getElementById('studentFilterStatus');
    const resetStudentFiltersBtn = document.getElementById('resetStudentFilters');

    const editStudentModal = document.getElementById('editStudentModal');
    const editStudentForm = document.getElementById('editStudentForm');
    const editStudentMatriculeInput = document.getElementById('editStudentMatricule');
    const editFullNameInput = document.getElementById('editFullName');
    const editEmailInput = document.getElementById('editEmail');
    const editPhoneInput = document.getElementById('editPhone');
    const editSchoolSelect = document.getElementById('editSchool');
    const editFieldSelect = document.getElementById('editField');
    const editProgramTypeSelect = document.getElementById('editProgramType');
    const editApprovedStatusSelect = document.getElementById('editApprovedStatus');

    const addLecturerBtn = document.getElementById('addLecturerBtn');
    const lecturerTableContainer = document.getElementById('lecturerTableContainer');
    const addEditLecturerModal = document.getElementById('addEditLecturerModal');
    const lecturerModalTitle = document.getElementById('lecturerModalTitle');
    const lecturerForm = document.getElementById('lecturerForm');
    const lecturerIdHidden = document.getElementById('lecturerIdHidden');
    const lecturerNameInput = document.getElementById('lecturerName');
    const lecturerEmailInput = document.getElementById('lecturerEmail');
    const lecturerPhoneInput = document.getElementById('lecturerPhone');
    const lecturerDepartmentSelect = document.getElementById('lecturerDepartment');
    const lecturerPasswordInput = document.getElementById('lecturerPassword');

    const departmentListContainer = document.getElementById('departmentListContainer');


    // Function to check admin login status and redirect if not logged in
    function checkAdminLoginStatus() {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        const userType = sessionStorage.getItem('userType');

        if (!loggedInUser || userType !== 'admin') {
            window.location.href = 'login.html'; // Redirect to login page
        }
        return JSON.parse(loggedInUser);
    }

    if (adminWelcomeMessage) { // Check if elements exist (meaning we're on admin-dashboard.html)
        const admin = checkAdminLoginStatus(); // Get logged-in admin data, or redirect

        if (admin) {
            adminWelcomeMessage.textContent = `Welcome, ${admin.name.split(' ')[0]}!`;

            // --- Admin Tab Navigation ---
            adminNavTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetTabId = e.target.dataset.tab;

                    adminNavTabs.forEach(link => link.classList.remove('active'));
                    e.target.classList.add('active');

                    adminTabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === targetTabId) {
                            content.classList.add('active');
                        }
                    });

                    // Load content for the activated tab
                    if (targetTabId === 'students') {
                        renderStudentTable();
                    } else if (targetTabId === 'lecturers') {
                        renderLecturerTable();
                    } else if (targetTabId === 'departments') {
                        renderDepartmentList();
                    }
                });
            });

            // Set initial active tab
            document.querySelector('.admin-nav-tabs a.active').click();


            // --- Student Management Functions ---
            function renderStudentTable() {
                const students = getLocalStorageData('students');
                const schools = getLocalStorageData('schools'); // For filtering dropdown

                // Populate filter options if not already
                if (studentFilterSchool.options.length <= 1) { // Only "All Schools" is there
                    for (const schoolName in schools) {
                        const option = document.createElement('option');
                        option.value = schoolName;
                        option.textContent = schoolName;
                        studentFilterSchool.appendChild(option);
                    }
                }

                filterStudentsAndRender(); // Initial render with filters
            }

            function filterStudentsAndRender() {
                const allStudents = getLocalStorageData('students');
                const selectedSchool = studentFilterSchool.value;
                const selectedStatus = studentFilterStatus.value;

                const filteredStudents = allStudents.filter(student => {
                    const schoolMatch = selectedSchool === 'all' || student.school === selectedSchool;
                    const statusMatch = selectedStatus === 'all' ||
                                        (selectedStatus === 'pending' && student.approved === false) ||
                                        (selectedStatus === 'approved' && student.approved === true) ||
                                        (selectedStatus === 'declined' && student.approved === 'declined'); // Assuming 'declined' status
                    return schoolMatch && statusMatch;
                });

                let tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Matricule</th>
                                <th>Full Name</th>
                                <th>School</th>
                                <th>Field</th>
                                <th>Program</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                if (filteredStudents.length === 0) {
                    tableHTML += `<tr><td colspan="7" class="no-results">No students found matching current filters.</td></tr>`;
                } else {
                    filteredStudents.forEach(student => {
                        let statusText = '';
                        let statusClass = '';
                        if (student.approved === true) {
                            statusText = 'Approved';
                            statusClass = 'status-approved';
                        } else if (student.approved === false) {
                            statusText = 'Pending';
                            statusClass = 'status-pending';
                        } else if (student.approved === 'declined') { // Custom status for declined
                            statusText = 'Declined';
                            statusClass = 'status-declined';
                        }

                        tableHTML += `
                            <tr>
                                <td>${student.matricule}</td>
                                <td>${student.fullName}</td>
                                <td>${student.school}</td>
                                <td>${student.field}</td>
                                <td>${student.programType}</td>
                                <td><span class="${statusClass}">${statusText}</span></td>
                                <td class="actions">
                                    ${student.approved === false ? `<button class="action-btn approve" data-matricule="${student.matricule}">Approve</button>` : ''}
                                    ${student.approved !== 'declined' ? `<button class="action-btn decline" data-matricule="${student.matricule}">Decline</button>` : ''}
                                    <button class="action-btn edit" data-matricule="${student.matricule}">Edit</button>
                                    <button class="action-btn delete" data-matricule="${student.matricule}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                        </tbody>
                    </table>
                `;
                studentTableContainer.innerHTML = tableHTML;
            }

            // Event listeners for student filters
            studentFilterSchool.addEventListener('change', filterStudentsAndRender);
            studentFilterStatus.addEventListener('change', filterStudentsAndRender);
            resetStudentFiltersBtn.addEventListener('click', () => {
                studentFilterSchool.value = 'all';
                studentFilterStatus.value = 'all';
                filterStudentsAndRender();
            });


            // Student Actions (Approve, Decline, Edit, Delete)
            studentTableContainer.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('action-btn')) {
                    const matricule = target.dataset.matricule;
                    let students = getLocalStorageData('students');
                    const studentIndex = students.findIndex(s => s.matricule === matricule);

                    if (studentIndex === -1) return;

                    if (target.classList.contains('approve')) {
                        if (confirm(`Approve student ${students[studentIndex].fullName}?`)) {
                            students[studentIndex].approved = true;
                            setLocalStorageData('students', students);
                            filterStudentsAndRender(); // Re-render table
                        }
                    } else if (target.classList.contains('decline')) {
                        if (confirm(`Decline student ${students[studentIndex].fullName}?`)) {
                            students[studentIndex].approved = 'declined'; // Set custom 'declined' status
                            setLocalStorageData('students', students);
                            filterStudentsAndRender(); // Re-render table
                        }
                    } else if (target.classList.contains('delete')) {
                        if (confirm(`Are you sure you want to delete student ${students[studentIndex].fullName}? This action cannot be undone.`)) {
                            students.splice(studentIndex, 1);
                            setLocalStorageData('students', students);
                            filterStudentsAndRender(); // Re-render table
                        }
                    } else if (target.classList.contains('edit')) {
                        // Populate modal with student data
                        const studentToEdit = students[studentIndex];
                        editStudentMatriculeInput.value = studentToEdit.matricule;
                        editFullNameInput.value = studentToEdit.fullName;
                        editEmailInput.value = studentToEdit.email;
                        editPhoneInput.value = studentToEdit.phone;
                        editProgramTypeSelect.value = studentToEdit.programType;
                        editApprovedStatusSelect.value = String(studentToEdit.approved); // Convert boolean to string for select

                        // Populate School dropdown and then Field dropdown
                        populateEditFormSchools(studentToEdit.school, studentToEdit.field);

                        editStudentModal.style.display = 'flex';
                    }
                }
            });

            // Populate edit student form's school and field dropdowns
            function populateEditFormSchools(selectedSchool = '', selectedField = '') {
                const schoolsData = getLocalStorageData('schools');
                editSchoolSelect.innerHTML = '<option value="">Select School</option>';
                for (const schoolName in schoolsData) {
                    const option = document.createElement('option');
                    option.value = schoolName;
                    option.textContent = schoolName;
                    editSchoolSelect.appendChild(option);
                }
                if (selectedSchool) {
                    editSchoolSelect.value = selectedSchool;
                    populateEditFormFields(selectedSchool, selectedField);
                }
            }

            function populateEditFormFields(schoolName, selectedField = '') {
                const schoolsData = getLocalStorageData('schools');
                const fields = schoolsData[schoolName] || [];
                editFieldSelect.innerHTML = '<option value="">Select Field of Study</option>';
                fields.forEach(field => {
                    const option = document.createElement('option');
                    option.value = field;
                    option.textContent = field;
                    editFieldSelect.appendChild(option);
                });
                if (selectedField) {
                    editFieldSelect.value = selectedField;
                }
            }

            // Event listener for school change in edit modal
            editSchoolSelect.addEventListener('change', () => {
                populateEditFormFields(editSchoolSelect.value);
            });

            // Handle edit student form submission
            editStudentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const matriculeToUpdate = editStudentMatriculeInput.value;
                let students = getLocalStorageData('students');
                const studentIndex = students.findIndex(s => s.matricule === matriculeToUpdate);

                if (studentIndex !== -1) {
                    students[studentIndex].fullName = editFullNameInput.value.trim();
                    students[studentIndex].email = editEmailInput.value.trim();
                    students[studentIndex].phone = editPhoneInput.value.trim();
                    students[studentIndex].school = editSchoolSelect.value;
                    students[studentIndex].field = editFieldSelect.value;
                    students[studentIndex].programType = editProgramTypeSelect.value;
                    students[studentIndex].approved = editApprovedStatusSelect.value === 'true' ? true : (editApprovedStatusSelect.value === 'false' ? false : 'declined');

                    setLocalStorageData('students', students);
                    editStudentModal.style.display = 'none';
                    filterStudentsAndRender(); // Re-render table with updated data
                }
            });

            // --- Lecturer Management Functions ---
            function renderLecturerTable() {
                const lecturers = getLocalStorageData('lecturers');
                let tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                if (lecturers.length === 0) {
                    tableHTML += `<tr><td colspan="6" class="no-results">No lecturers registered.</td></tr>`;
                } else {
                    lecturers.forEach(lecturer => {
                        tableHTML += `
                            <tr>
                                <td>${lecturer.id}</td>
                                <td>${lecturer.name}</td>
                                <td>${lecturer.email}</td>
                                <td>${lecturer.phone || 'N/A'}</td>
                                <td>${lecturer.department || 'Unassigned'}</td>
                                <td class="actions">
                                    <button class="action-btn edit" data-id="${lecturer.id}"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn delete" data-id="${lecturer.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                        </tbody>
                    </table>
                `;
                lecturerTableContainer.innerHTML = tableHTML;
            }

            // Populate lecturer department dropdown
            function populateLecturerDepartments() {
                const schools = getLocalStorageData('schools');
                lecturerDepartmentSelect.innerHTML = '<option value="">Select Department</option>';
                for (const schoolName in schools) {
                    const option = document.createElement('option');
                    option.value = schoolName;
                    option.textContent = schoolName;
                    lecturerDepartmentSelect.appendChild(option);
                }
            }
            populateLecturerDepartments(); // Call on page load for lecturer modal

            // Add/Edit Lecturer Modal controls
            addLecturerBtn.addEventListener('click', () => {
                lecturerForm.reset();
                lecturerIdHidden.value = ''; // Clear hidden ID for add mode
                lecturerModalTitle.textContent = 'Add New Lecturer';
                lecturerPasswordInput.required = true; // Password always required for new
                addEditLecturerModal.style.display = 'flex';
            });

            lecturerTableContainer.addEventListener('click', (e) => {
                const target = e.target;
                const lecturerId = target.dataset.id || target.closest('.action-btn')?.dataset.id;

                if (!lecturerId) return;

                if (target.classList.contains('edit') || target.closest('.action-btn')?.classList.contains('edit')) {
                    const lecturers = getLocalStorageData('lecturers');
                    const lecturerToEdit = lecturers.find(l => l.id === lecturerId);
                    if (lecturerToEdit) {
                        lecturerIdHidden.value = lecturerToEdit.id;
                        lecturerNameInput.value = lecturerToEdit.name;
                        lecturerEmailInput.value = lecturerToEdit.email;
                        lecturerPhoneInput.value = lecturerToEdit.phone || '';
                        lecturerDepartmentSelect.value = lecturerToEdit.department || '';
                        lecturerPasswordInput.value = lecturerToEdit.password; // Pre-fill password for editing
                        lecturerPasswordInput.required = false; // Password not strictly required for edit unless changed

                        lecturerModalTitle.textContent = 'Edit Lecturer Information';
                        addEditLecturerModal.style.display = 'flex';
                    }
                } else if (target.classList.contains('delete') || target.closest('.action-btn')?.classList.contains('delete')) {
                    if (confirm(`Are you sure you want to delete this lecturer?`)) {
                        let lecturers = getLocalStorageData('lecturers');
                        lecturers = lecturers.filter(l => l.id !== lecturerId);
                        setLocalStorageData('lecturers', lecturers);
                        renderLecturerTable();
                    }
                }
            });

            lecturerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let lecturers = getLocalStorageData('lecturers');
                const formId = lecturerIdHidden.value; // Check if it's an existing lecturer ID

                const newOrUpdatedLecturer = {
                    id: formId || `L${String(lecturers.length + 1).padStart(3, '0')}`, // Generate new ID if adding
                    name: lecturerNameInput.value.trim(),
                    email: lecturerEmailInput.value.trim(),
                    phone: lecturerPhoneInput.value.trim(),
                    department: lecturerDepartmentSelect.value,
                    password: lecturerPasswordInput.value // Use current password input value
                };

                if (formId) { // Editing existing lecturer
                    const index = lecturers.findIndex(l => l.id === formId);
                    if (index !== -1) {
                         // Only update password if explicitly provided, otherwise keep old one
                        if (lecturerPasswordInput.value) {
                            newOrUpdatedLecturer.password = lecturerPasswordInput.value;
                        } else {
                            newOrUpdatedLecturer.password = lecturers[index].password; // Keep old password
                        }
                        lecturers[index] = newOrUpdatedLecturer;
                    }
                } else { // Adding new lecturer
                    lecturers.push(newOrUpdatedLecturer);
                }

                setLocalStorageData('lecturers', lecturers);
                addEditLecturerModal.style.display = 'none';
                renderLecturerTable();
            });


            // --- Department Management Functions ---
            function renderDepartmentList() {
                const schoolsData = getLocalStorageData('schools');
                const lecturers = getLocalStorageData('lecturers');
                let listHTML = '';

                for (const schoolName in schoolsData) {
                    const hod = lecturers.find(l => l.department === schoolName && l.isHOD); // Assuming an 'isHOD' property
                    listHTML += `
                        <div class="department-item">
                            <div>
                                <h4>${schoolName}</h4>
                                <span class="head-of-dept">Head: ${hod ? hod.name : 'Not Assigned'}</span>
                            </div>
                            <div class="actions">
                                </div>
                        </div>
                    `;
                }
                if (listHTML === '') {
                    listHTML = '<p class="no-results">No departments found.</p>';
                }
                departmentListContainer.innerHTML = listHTML;
            }


            // --- Admin Logout ---
            if (adminLogoutBtn) {
                adminLogoutBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    sessionStorage.removeItem('loggedInUser');
                    sessionStorage.removeItem('userType');
                    window.location.href = 'login.html';
                });
            }
        }
    }

    // --- Modal Closing (reusing existing modal close logic, ensure it handles new modals) ---
    // Make sure your existing close-button listeners target all elements with that class
    // or specifically target the new modal close buttons.
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.closest('.modal').style.display = 'none';
            // Clear form validation errors if any modal form is closed
            document.querySelectorAll('.form-group.error').forEach(formGroup => {
                formGroup.classList.remove('error');
                const errorMessageDiv = formGroup.querySelector('.error-message');
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = '';
                }
            });
        });
    });

    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == editStudentModal) {
            editStudentModal.style.display = 'none';
        }
        if (event.target == addEditLecturerModal) {
            addEditLecturerModal.style.display = 'none';
        }
        // ... (existing modal close for successModal, errorModal)
    });


    // Helper functions (already in app.js, just for context)
    // function getLocalStorageData(key) { ... }
    // function setLocalStorageData(key, data) { ... }
    // function formatLabel(key) { ... }
    // function isValidEmail(email) { ... }
    // function isValidPhone(phone) { ... }
});











// js/app.js (Add this inside the existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for loadInitialData, hamburger menu, registration logic, login logic, student dashboard logic, admin dashboard logic) ...

    // --- Lecturer Panel Logic ---
    const lecturerWelcomeMessage = document.getElementById('lecturerWelcomeMessage');
    const lecturerLogoutBtn = document.getElementById('lecturerLogoutBtn');
    const lecturerCourseList = document.getElementById('lecturerCourseList');
    const courseDetailsSection = document.getElementById('courseDetailsSection');
    const resultsEntrySection = document.getElementById('resultsEntrySection');
    const currentCourseTitle = document.getElementById('currentCourseTitle');
    const studentResultsTableContainer = document.getElementById('studentResultsTableContainer');
    const resultsForm = document.getElementById('resultsForm');
    const resultsFilterSchool = document.getElementById('resultsFilterSchool');
    const resultsFilterField = document.getElementById('resultsFilterField');
    const resetResultsFiltersBtn = document.getElementById('resetResultsFilters');

    let currentSelectedCourseId = null; // To keep track of the currently selected course

    // Function to check lecturer login status and redirect if not logged in
    function checkLecturerLoginStatus() {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        const userType = sessionStorage.getItem('userType');

        if (!loggedInUser || userType !== 'lecturer') {
            window.location.href = 'login.html'; // Redirect to login page
        }
        return JSON.parse(loggedInUser);
    }

    if (lecturerWelcomeMessage) { // Check if elements exist (meaning we're on lecturer-panel.html)
        const lecturer = checkLecturerLoginStatus(); // Get logged-in lecturer data, or redirect

        if (lecturer) {
            lecturerWelcomeMessage.textContent = `Welcome, ${lecturer.name.split(' ')[0]}!`;

            // --- Populate Assigned Courses ---
            function renderLecturerCourses() {
                const allCourses = getLocalStorageData('courses');
                // Filter courses assigned to this lecturer
                const assignedCourses = allCourses.filter(course => course.lecturerId === lecturer.id);

                lecturerCourseList.innerHTML = ''; // Clear "Loading courses..."
                if (assignedCourses.length > 0) {
                    assignedCourses.forEach(course => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = `#`; // No actual navigation, just for JS click
                        link.dataset.courseId = course.id;
                        link.innerHTML = `<i class="fas fa-chalkboard"></i> ${course.name}`;
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            selectCourse(course);
                            // Highlight active course
                            lecturerCourseList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                            link.classList.add('active');
                        });
                        listItem.appendChild(link);
                        lecturerCourseList.appendChild(listItem);
                    });
                } else {
                    lecturerCourseList.innerHTML = '<li>No courses currently assigned to you.</li>';
                }
            }
            renderLecturerCourses();

            // --- Select Course and Load Students for Results Entry ---
            function selectCourse(course) {
                currentSelectedCourseId = course.id; // Store current course ID
                courseDetailsSection.classList.add('hidden');
                resultsEntrySection.classList.remove('hidden');
                currentCourseTitle.querySelector('span').textContent = course.name;

                // Populate filter dropdowns based on students taking this course
                populateResultsFilters(course.id);
                renderStudentsForResults(course.id);
            }

            function populateResultsFilters(courseId) {
                const allStudents = getLocalStorageData('students');
                const courseStudents = allStudents.filter(student =>
                    student.approved === true && // Only approved students
                    student.results && // student.results exists
                    !Object.keys(student.results).includes(courseId) && // Student hasn't received this course's result yet
                    getLocalStorageData('courses').find(c => c.id === courseId)?.school === student.school &&
                    getLocalStorageData('courses').find(c => c.id === courseId)?.field === student.field
                );

                const uniqueSchools = [...new Set(courseStudents.map(s => s.school))];
                resultsFilterSchool.innerHTML = '<option value="all">All Schools</option>';
                uniqueSchools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school;
                    option.textContent = school;
                    resultsFilterSchool.appendChild(option);
                });

                // Clear and disable field filter initially
                resultsFilterField.innerHTML = '<option value="all">All Fields</option>';
                resultsFilterField.disabled = true;

                // Reset filter values
                resultsFilterSchool.value = 'all';
                resultsFilterField.value = 'all';
            }

            resultsFilterSchool.addEventListener('change', () => {
                const selectedSchool = resultsFilterSchool.value;
                const courseId = currentSelectedCourseId;
                const allStudents = getLocalStorageData('students');
                const courseStudents = allStudents.filter(student =>
                    student.approved === true &&
                    student.results &&
                    !Object.keys(student.results).includes(courseId) &&
                    getLocalStorageData('courses').find(c => c.id === courseId)?.school === student.school &&
                    getLocalStorageData('courses').find(c => c.id === courseId)?.field === student.field &&
                    (selectedSchool === 'all' || student.school === selectedSchool)
                );

                const uniqueFields = [...new Set(courseStudents.map(s => s.field))];
                resultsFilterField.innerHTML = '<option value="all">All Fields</option>';
                if (uniqueFields.length > 0 && selectedSchool !== 'all') {
                    uniqueFields.forEach(field => {
                        const option = document.createElement('option');
                        option.value = field;
                        option.textContent = field;
                        resultsFilterField.appendChild(option);
                    });
                    resultsFilterField.disabled = false;
                } else {
                    resultsFilterField.disabled = true;
                }
                renderStudentsForResults(courseId); // Re-render table with new filters
            });

            resultsFilterField.addEventListener('change', () => {
                renderStudentsForResults(currentSelectedCourseId); // Re-render table with new filters
            });

            resetResultsFiltersBtn.addEventListener('click', () => {
                resultsFilterSchool.value = 'all';
                resultsFilterField.value = 'all';
                resultsFilterField.disabled = true;
                renderStudentsForResults(currentSelectedCourseId);
            });


            function renderStudentsForResults(courseId) {
                const allStudents = getLocalStorageData('students');
                const selectedSchool = resultsFilterSchool.value;
                const selectedField = resultsFilterField.value;

                // Students who are approved, enrolled in this course's school/field, and don't yet have a result for this course
                const studentsToScore = allStudents.filter(student =>
                    student.approved === true &&
                    getLocalStorageData('courses').find(c => c.id === courseId)?.school === student.school &&
                    getLocalStorageData('courses').find(c => c.id === courseId)?.field === student.field &&
                    !Object.keys(student.results).includes(courseId) && // Filter out students who already have a score for this course
                    (selectedSchool === 'all' || student.school === selectedSchool) &&
                    (selectedField === 'all' || student.field === selectedField)
                );

                let tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Matricule</th>
                                <th>Full Name</th>
                                <th>School</th>
                                <th>Field</th>
                                <th>Score (0-100)</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                if (studentsToScore.length === 0) {
                    tableHTML += `<tr><td colspan="5" class="no-results">No eligible students found for this course, or all students already have results.</td></tr>`;
                } else {
                    studentsToScore.forEach(student => {
                        tableHTML += `
                            <tr>
                                <td>${student.matricule}</td>
                                <td>${student.fullName}</td>
                                <td>${student.school}</td>
                                <td>${student.field}</td>
                                <td><input type="number" name="score_${student.matricule}" min="0" max="100" step="1" required></td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                        </tbody>
                    </table>
                `;
                studentResultsTableContainer.innerHTML = tableHTML;
            }

            // --- Handle Results Form Submission ---
            resultsForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (!currentSelectedCourseId) {
                    alert('Please select a course first.');
                    return;
                }

                let students = getLocalStorageData('students');
                const formInputs = resultsForm.elements;
                let resultsSavedCount = 0;

                for (let i = 0; i < formInputs.length; i++) {
                    const input = formInputs[i];
                    if (input.name.startsWith('score_') && input.type === 'number') {
                        const matricule = input.name.replace('score_', '');
                        const score = parseInt(input.value);

                        if (isNaN(score) || score < 0 || score > 100) {
                            alert(`Please enter a valid score between 0-100 for ${matricule}`);
                            return; // Stop submission if any score is invalid
                        }

                        const studentIndex = students.findIndex(s => s.matricule === matricule);
                        if (studentIndex !== -1) {
                            if (!students[studentIndex].results) {
                                students[studentIndex].results = {};
                            }
                            students[studentIndex].results[currentSelectedCourseId] = score;
                            resultsSavedCount++;
                        }
                    }
                }

                if (resultsSavedCount > 0) {
                    setLocalStorageData('students', students);
                    alert(`${resultsSavedCount} result(s) saved successfully for students in ${currentCourseTitle.querySelector('span').textContent}!`);
                    renderStudentsForResults(currentSelectedCourseId); // Re-render table to show updated list
                } else {
                    alert('No new results to save or no valid scores entered.');
                }
            });


            // --- Lecturer Logout ---
            if (lecturerLogoutBtn) {
                lecturerLogoutBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    sessionStorage.removeItem('loggedInUser');
                    sessionStorage.removeItem('userType');
                    window.location.href = 'login.html';
                });
            }
        }
    }
});











// js/app.js (Add this inside the existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for loadInitialData, hamburger menu, registration logic, login logic, student dashboard logic, admin dashboard logic, lecturer panel logic, events page logic, home page logic) ...

    // --- Contact Page Logic ---
    const contactForm = document.getElementById('contactForm');
    const contactNameInput = document.getElementById('contactName');
    const contactEmailInput = document.getElementById('contactEmail');
    const contactSubjectInput = document.getElementById('contactSubject');
    const contactMessageInput = document.getElementById('contactMessage');
    const contactFormMessage = document.getElementById('contactFormMessage');

    if (contactForm) { // Check if elements exist (meaning we're on contact.html)
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Clear previous messages
            contactFormMessage.classList.add('hidden');
            contactFormMessage.textContent = '';
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

            // Validate Name
            if (contactNameInput.value.trim() === '') {
                document.getElementById('contactNameError').textContent = 'Name is required.';
                document.getElementById('contactNameError').style.display = 'block';
                isValid = false;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (contactEmailInput.value.trim() === '') {
                document.getElementById('contactEmailError').textContent = 'Email is required.';
                document.getElementById('contactEmailError').style.display = 'block';
                isValid = false;
            } else if (!emailRegex.test(contactEmailInput.value.trim())) {
                document.getElementById('contactEmailError').textContent = 'Please enter a valid email address.';
                document.getElementById('contactEmailError').style.display = 'block';
                isValid = false;
            }

            // Validate Subject
            if (contactSubjectInput.value.trim() === '') {
                document.getElementById('contactSubjectError').textContent = 'Subject is required.';
                document.getElementById('contactSubjectError').style.display = 'block';
                isValid = false;
            }

            // Validate Message
            if (contactMessageInput.value.trim() === '') {
                document.getElementById('contactMessageError').textContent = 'Message is required.';
                document.getElementById('contactMessageError').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission
                console.log('Contact Form Data:', {
                    name: contactNameInput.value,
                    email: contactEmailInput.value,
                    subject: contactSubjectInput.value,
                    message: contactMessageInput.value
                });

                contactFormMessage.classList.remove('hidden', 'error');
                contactFormMessage.classList.add('success');
                contactFormMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                contactForm.reset(); // Clear the form

                // Optional: Hide message after a few seconds
                setTimeout(() => {
                    contactFormMessage.classList.add('hidden');
                }, 5000);

            } else {
                contactFormMessage.classList.remove('hidden', 'success');
                contactFormMessage.classList.add('error');
                contactFormMessage.textContent = 'Please correct the errors in the form.';
            }
        });
    }
});







// js/app.js (Add this inside the existing DOMContentLoaded listener)

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for loadInitialData, hamburger menu, registration logic, login logic, student dashboard logic, admin dashboard logic, lecturer panel logic, events page logic) ...

    // --- Home Page Logic ---
    const featuredProgramsContainer = document.getElementById('featuredProgramsContainer');
    const homePageEventsContainer = document.getElementById('homePageEventsContainer');
    const homeNoEventsMessage = document.getElementById('homeNoEventsMessage');

    if (featuredProgramsContainer && homePageEventsContainer) { // Check if elements exist (meaning we're on index.html)
        // Render Featured Programs (e.g., top 3)
        function renderFeaturedPrograms() {
            const allSchools = getLocalStorageData('schools'); // Get all schools and their fields

            featuredProgramsContainer.innerHTML = ''; // Clear loading message

            let programsCount = 0;
            // Iterate through schools and their fields to display as programs
            for (const schoolName in allSchools) {
                const fields = allSchools[schoolName];
                fields.forEach(field => {
                    if (programsCount < 3) { // Display a limited number of programs on homepage
                        const programCard = document.createElement('div');
                        programCard.classList.add('program-card');
                        programCard.innerHTML = `
                            <h3>${field}</h3>
                            <div class="program-details">
                                <p><strong>School:</strong> ${schoolName}</p>
                                <p>This program focuses on preparing students for careers in ${field.toLowerCase()} within the ${schoolName} domain.</p>
                                <ul>
                                    <li><i class="fas fa-check-circle"></i> Industry-relevant curriculum</li>
                                    <li><i class="fas fa-check-circle"></i> Practical training & workshops</li>
                                    <li><i class="fas fa-check-circle"></i> Experienced faculty</li>
                                </ul>
                                <a href="pages/programs.html" class="btn btn-primary">Learn More</a>
                            </div>
                        `;
                        featuredProgramsContainer.appendChild(programCard);
                        programsCount++;
                    }
                });
            }

            if (programsCount === 0) {
                featuredProgramsContainer.innerHTML = '<p class="no-results-message">No programs available yet.</p>';
            }
        }
        renderFeaturedPrograms(); // Call on load


        // Render Upcoming Events (e.g., next 3)
        function renderHomePageEvents() {
            let allEvents = getLocalStorageData('events');

            // Sort events by date in ascending order
            allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Filter to only show future or current events
            const upcomingEvents = allEvents.filter(event => new Date(event.date) >= new Date(new Date().setHours(0,0,0,0)));

            homePageEventsContainer.innerHTML = ''; // Clear loading message
            if (upcomingEvents.length > 0) {
                homeNoEventsMessage.classList.add('hidden'); // Hide no events message
                upcomingEvents.slice(0, 3).forEach(event => { // Display only the first 3
                    const eventDate = new Date(event.date);
                    const day = eventDate.getDate();
                    const month = eventDate.toLocaleString('en-US', { month: 'short' });
                    const year = eventDate.getFullYear();

                    const eventCard = document.createElement('div');
                    eventCard.classList.add('event-card');
                    eventCard.innerHTML = `
                        <div class="event-date">
                            <span>${day}</span>
                            ${month}<br>${year}
                        </div>
                        <div class="event-content">
                            <span class="event-category">${event.category}</span>
                            <h4>${event.title}</h4>
                            <p>${event.description}</p>
                            <span class="event-time"><i class="fas fa-clock"></i> ${event.time}</span>
                            <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                    `;
                    homePageEventsContainer.appendChild(eventCard);
                });
            } else {
                homeNoEventsMessage.classList.remove('hidden'); // Show no events message
            }
        }
        renderHomePageEvents(); // Call on load
    }
});