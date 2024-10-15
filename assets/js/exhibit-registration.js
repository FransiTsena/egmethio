function navigateToHome() {
    window.location.href = "./";
}

var isLoading = false;


function setMaxDates() {
    var today = new Date();

    var formattedTodaysDate = today.toISOString().split('T')[0];

    var arrivalDate = document.getElementById("arrival-date");
    var departureDate = document.getElementById("departure-date");

    arrivalDate.setAttribute("min", formattedTodaysDate);
    departureDate.setAttribute("min", formattedTodaysDate);
}

setMaxDates();

document.getElementById('personal-info-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    // Get the selected booth size value
    var selectedBoothSize = document.querySelector('input[name="booth_size"]:checked');
    var boothSize = selectedBoothSize ? selectedBoothSize.value : '';

    var formData = {
        // Personal Information
        city: document.getElementById('title').value.trim(),
        country: document.getElementById('country').value.trim(),
        population: document.getElementById('population').value.trim(),
        description: document.getElementById('description').value.trim(),
        // Exhibit Details
        exhibitTitle: document.getElementById('exhibit-title').value.trim(),
        exhibitSummary: document.getElementById('exhibit-summary').value.trim(),
        innovations: document.getElementById('innovations').value.trim(),
        // Exhibit Requirements
        boothSize: boothSize,
        layoutPreferences: document.getElementById('layout-preferences').value.trim(),
        technicalNeeds: document.getElementById('technical-needs').value.trim(),
        specialRequests: document.getElementById('special-requests').value.trim(),
        // Contact Information
        contactPerson: document.getElementById('contact-person').value.trim(),
        contactTitle: document.getElementById('contact-title').value.trim(),
        organization: document.getElementById('organization').value.trim(),
        email: document.getElementById('email').value.trim(),
        phoneNumber: document.getElementById('phone-number').value.trim(),
        // Supporting Documents
        proposalUpload: document.getElementById('proposal-upload').files[0],
        visualsUpload: document.getElementById('visuals-upload').files[0],
        // Logistical Information
        arrivalDate: document.getElementById('arrival-date').value,
        departureDate: document.getElementById('departure-date').value,
        setupRequirements: document.getElementById('setup-requirements').value.trim(),
        // Additional Information
        previousExhibitions: document.getElementById('previous-exhibitions').value.trim(),
        teamInformation: document.getElementById('team-information').value.trim(),
        // Auth Information
        authEmail: document.getElementById('auth-email').value.trim(),
    };

    // Validation checks
    if (
        // Personal Information
        !formData.city || !formData.country || !formData.description ||
        // Exhibit Details
        !formData.exhibitTitle || !formData.exhibitSummary || !formData.innovations ||
        // Exhibit Requirements
        !formData.boothSize || !formData.layoutPreferences || !formData.technicalNeeds ||
        // Contact Information
        !formData.contactPerson || !formData.contactTitle || !formData.organization ||
        !formData.email || !formData.phoneNumber ||
        // Supporting Documents
        !formData.proposalUpload ||
        // Logistical Information
        !formData.arrivalDate || !formData.departureDate || !formData.setupRequirements ||
        // Additional Information
        !formData.teamInformation 
    ) {
        return showSnackBar("Please fill all the required fields.");
    } else if (!formData.boothSize) {
        return showSnackBar("Please select a booth size.");
    } else if (!validateEmail(formData.email)) {
        return showSnackBar("Please enter a valid email address.");
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
        return showSnackBar("Please enter a valid phone number.");
    } else if (!validateDates(formData.arrivalDate, formData.departureDate)) {
        return showSnackBar("Departure date can't be before arrival date.");
    } else if (!validateWordCount(formData, 2000)) {
        return showSnackBar("Each field must have no more than 2000 words.");
    }
    try {
        isLoading = true;
        updateProgress();
        const uid = await new BeeStore({ path: `ExpoApplications` }).getId();
        const serverTime = await new BeeStore({ path: "" }).serverTime();
        if (uid != null && serverTime != null) {
            await startRegistration(response.body.uid, serverTime);
        } else {
            return showSnackBar("Failed to connect. Please try again.");
        }
        async function startRegistration(uid, serverTime) {
                const proposalUploadURL = await uploadFile(formData.proposalUpload, `ExpoApplications/${uid}/${formData.proposalUpload.name}`);
                const visualsUploadURL = formData.visualsUpload ? await uploadFile(formData.visualsUpload, `ExpoApplications/${uid}/${formData.visualsUpload.name}`) : null;

                if (proposalUploadURL && (formData.visualsUpload ? visualsUploadURL : true)) {
                    const responseStatus = await register(uid, formData, proposalUploadURL, visualsUploadURL, parseDate(serverTime));
                    if (responseStatus === 200) {
                        showAlert();
                    } else {
                        showSnackBar("Failed to register. Please try again later.");
                    }
                } else {
                    showSnackBar("Failed to register. Please try again later.");
                }
        };

    } catch (error) {
        console.log("Error creating user:", error);
        showSnackBar("Failed to create account. Please try again later.");
    }

    isLoading = false;
    updateProgress();
});

function updateProgress() {
    const progressOverlay = document.getElementById('progressOverlay');
    if (isLoading) {
        progressOverlay.style.display = 'flex';
    } else {
        progressOverlay.style.display = 'none';
    }
}

function showAlert() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('messageBox').style.display = 'flex';
}

function showSnackBar(message) {
    var snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.classList.add('show');
    setTimeout(function () {
        snackbar.classList.remove('show');
    }, 3000);
}

function hideMessageBox() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('messageBox').style.display = 'none';
    document.getElementById('personal-info-form').reset();
}



function validateDates(issueDate, expiryDate) {
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);
    return expiry > issue;
}

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

async function uploadFile(file, path) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const uint8Array = new Uint8Array(event.target.result);
            const beeStorage = new BeeStorage();
            try {
                const response = await beeStorage.upload({ file: uint8Array, path });
                if (response) {
                    resolve(`${schem}://${address}:${storagePort}/${projectId}/${path}`);
                } else {
                    reject(null);
                }
            } catch (error) {
                console.error(error);
                reject(null);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}


function parseDate(dateString) {
    return (new Date(dateString)).getTime();
}
async function register(uid, formData, proposalUploadURL, visualsUploadURL, serverTime) {
    try {
        var request = await new BeeStore({ path: `ExpoApplications/${uid}` }).setDoc({
            "city": formData.city,
            "country": formData.country,
            "population": formData.population,
            "description": formData.description,
            "exhibitTitle": formData.exhibitTitle,
            "exhibitSummary": formData.exhibitSummary,
            "innovations": formData.innovations,
            "boothSize": formData.boothSize,
            "layoutPreferences": formData.layoutPreferences,
            "technicalNeeds": formData.technicalNeeds,
            "specialRequests": formData.specialRequests,
            "contactPerson": formData.contactPerson,
            "contactTitle": formData.contactTitle,
            "organization": formData.organization,
            "email": formData.email,
            "phoneNumber": formData.phoneNumber,
            "arrivalDate": parseDate(formData.arrivalDate),
            "departureDate": parseDate(formData.departureDate),
            "setupRequirements": formData.setupRequirements,
            "previousExhibitions": formData.previousExhibitions,
            "teamInformation": formData.teamInformation,
            "proposalUploadURL": proposalUploadURL,
            "visualsUploadURL": visualsUploadURL,
            "search": `${formData.contactPerson} ${formData.country} ${formData.city}`,
            "timeStamp": serverTime
        }, { hasDocId: true });
        if (request === true) { return 200; }
    } catch (error) {
        throw new Error("Error registering data: " + error);
    }
}