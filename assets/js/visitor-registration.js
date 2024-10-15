function navigateToHome() {
    window.location.href = "../";
}

var isLoading = false;

document.getElementById('form-information').addEventListener('submit', async function (event) {
    event.preventDefault();
    // Gather form data
    var formData = {
        // Personal Information
        fullName: document.getElementById('full-name').value.trim(),
        sex: document.getElementById('sex').value.trim(),
        dob: document.getElementById('dob').value.trim(),
        passportNumber: document.getElementById('passport-number').value.trim(),
        street: document.getElementById('street').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        country: document.getElementById('personal-country').value.trim(),

        // Professional Experience
        title: document.getElementById('contact-title').value.trim(),
        organization: document.getElementById('organization').value.trim(),
        duration: document.getElementById('duration').value.trim(),
        responsibilities: document.getElementById('responsibilities').value.trim(),

        // Contact and Authorization
        email: document.getElementById('email').value.trim(),
        phoneNumber: document.getElementById('phone-number').value.trim(),
    };

    // Validate form data
    if (
        !formData.fullName || !formData.sex || !formData.dob || !formData.passportNumber ||
        !formData.street || !formData.city || !formData.state || !formData.country ||
        !formData.title || !formData.organization || !formData.duration ||
        !formData.email || !formData.phoneNumber
    ) {
        return showSnackBar("Please fill all the required fields.");
    } else if (!validateEmail(formData.email)) {
        return showSnackBar("Please enter a valid email address.");
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
        return showSnackBar("Please enter a valid phone number.");
    } else if (!validateWordCount(formData, 2000)) {
        return showSnackBar("Each field must have no more than 2000 words.");
    }

    try {
        isLoading = true;
        updateProgress();

        const serverTime = await new BeeStore({ path: "" }).serverTime();
        if (serverTime != null) {
            const responseStatus = await register(formData, parseDate(serverTime));
            if (responseStatus === 200) {
                showAlert();
            } else {
                showSnackBar("Failed to register. Please try again later.");
            }
        } else {
            showSnackBar("Failed to register. Please try again later.");
        }
    } catch (error) {
        console.log("Error creating user:", error);
        showSnackBar("Failed to create account. Please try again later.");
    }

    isLoading = false;
    updateProgress();
});

// Progress Indicator
function updateProgress() {
    const progressOverlay = document.getElementById('progressOverlay');
    progressOverlay.style.display = isLoading ? 'flex' : 'none';
}

// Snackbar notification
function showSnackBar(message) {
    var snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.classList.add('show');
    setTimeout(function () {
        snackbar.classList.remove('show');
    }, 3000);
}


function showAlert() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('messageBox').style.display = 'flex';
}

// Validation functions
function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhoneNumber(phoneNumber) {
    var phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
}

function validateWordCount(formData, maxWords) {
    for (let key in formData) {
        if (typeof formData[key] === 'string') {
            let wordCount = formData[key].split(/\s+/).length;
            if (wordCount > maxWords) {
                showSnackBar(`Field '${key}' has to have less than ${maxWords} words`);
                return false;
            }
        }
    }
    return true;
}

// Date Parsing
function parseDate(dateString) {
    return new Date(dateString).getTime();
}
function calculateAge(dateOfBirth) {
    var birthDate = new Date(dateOfBirth);
    var ageInMilliseconds = Date.now() - birthDate.getTime();
    var ageDate = new Date(ageInMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Registration Function
async function register(formData, serverTime) {
    try {
        
        const age = calculateAge(formData.dob);
        var inputData = {
            "fullName": formData.fullName,
            "sex": formData.sex,
            "birthDate": parseDate(formData.dob),
            "age": age,
            "passportNumber": formData.passportNumber,
            "street": formData.street,
            "city": formData.city,
            "state": formData.state,
            "country": formData.country,
            "title": formData.title,
            "organization": formData.organization,
            "duration": formData.duration,
            "responsibilities": formData.responsibilities,
            "email": formData.email,
            "phoneNumber": formData.phoneNumber,
            "timeStamp": serverTime
        };
        var request = await new BeeStore({ path: `VisitorApplications` }).addDoc(inputData);

        if (request != false && request != null) {
            return 200;
        }

        else {
            showSnackBar(request.body);
        }
    } catch (error) {
        throw new Error("Error registering data: " + error);
    }
}
