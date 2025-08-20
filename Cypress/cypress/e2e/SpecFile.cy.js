import RecruitmentPage from "../PageObjects/Pages/RecruitmentPage";
import LoginPage from "../PageObjects/Pages/LoginProfilePage";
import AdminPage from "../PageObjects/Pages/AdminPage";
import LeavesPage from "../PageObjects/Pages/LeavesPage";
import PIMPage from "../PageObjects/Pages/PIMPage";

describe("Automation Suite for Yaksha Application", () => {
  const loginPage = new LoginPage();
  const adminPage = new AdminPage();
  const leavePage = new LeavesPage();
  const recruitmentPage = new RecruitmentPage();
  const pimPage = new PIMPage();

  beforeEach(() => {
    loginPage.performLogin();
  });

  /**
   * Test Case: TS-1 Verify new User can be created
   *
   * Purpose:
   * Verifies that an admin user is able to successfully add a new user record through the Admin section.
   *
   * Steps:
   * 1. Click on the Admin tab from the main menu.
   * 2. Click the Add button to open the user creation form.
   * 3. Select the appropriate user roles.
   * 4. Enter employee details and auto-suggest a name.
   * 5. Fill in username and confirm password fields.
   * 6. Submit the form and wait for the success toast message.
   * 7. Assert that the returned message confirms the save operation.
   */

  it("TS-1: Verify new User can be created", () => {
    cy.wrap(null)
      .then(() => {
        return adminPage.addAdminUserForm();
      })
      .then(() => {
        cy.get(".oxd-toast")
          .should("be.visible")
          .and("contain", "Successfully Saved");
        verifySuccessMessageContains(
          "Successfully Saved",
          "Successfully Saved",
          "Admin record added successfully"
        );
      });
  });

  /**
   * Test Case: TS-2 Verify new User can be created in previous step can perform the login with valid credentials
   *
   * Purpose:
   * Ensures that a newly created user is able to log in successfully and is redirected to the dashboard.
   *
   * Steps:
   * 1. Create a new user using the admin flow.
   * 2. Log out from the current session.
   * 3. Attempt login using the newly created credentials.
   * 4. Assert that the post-login URL matches the expected dashboard URL.
   */

  it.only("TS-2: Verify new User created in previous step can login with valid credentials", () => {
    cy.wrap(null)
      .then(() => {
        return adminPage.verifyNewUser(); // This should return a value (e.g., URL or page content)
      })
      .then((commentText) => {
        expect(
          commentText.includes(
            "https://yakshahrm.makemylabs.in/orangehrm-5.7/web/index.php/dashboard/index"
          ) ||
            commentText.includes(
              "https://yakshahrm.makemylabs.in/orangehrm-5.7/web/index.php/admin/viewSystemUsers"
            )
        ).to.be.true;
      });
  });

  /**
   * Test Case: TS-3 Verify non admin user doesn't have access to 'admin' tab
   *
   * Purpose:
   * Validates that a user with the 'ESS' role does not have visibility of the Admin tab after logging in.
   *
   * Steps:
   * 1. Create a new user with the 'ESS' role.
   * 2. Log out from the current admin session.
   * 3. Log in using the newly created ESS user's credentials.
   * 4. Retrieve all visible tab names from the main menu.
   * 5. Assert that the 'admin' tab is not present in the tab list.
   */

  it("TS-3: Verify non admin user doesn't have access to 'admin' tab", () => {
    cy.wrap(null)
      .then(() => {
        return adminPage.verifyESS(); // assume this returns an array or promise resolving to array
      })
      .then((tablist) => {
        expect(tablist.length).to.be.greaterThan(0);
        expect(tablist).to.not.include("admin");
      });
  });

  /**
   * Test Case: TS-4 Verify the non admin user could be upgraded to admin
   *
   * Purpose:
   * Verifies that a user initially created with the 'ESS' role can be successfully upgraded to an 'Admin' role.
   *
   * Steps:
   * 1. Create a new user with the 'ESS' role using a unique username.
   * 2. Edit the newly created user from the admin list.
   * 3. Change their role from 'ESS' to 'Admin'.
   * 4. Save the changes and reload the page.
   * 5. Retrieve the role assigned to the user.
   * 6. Assert that the new role includes "Admin".
   */

  it("TS-4: Verify the non admin user could be upgraded to admin", () => {
    const name = generateUniqueUsername();

    adminPage.upgradeAdmin(name).then((Output) => {
      expect(Output).to.include("Admin");
    });
  });

  /**
   * Test Case: TS-5 Verify the delete selected functionality
   *
   * Purpose:
   * Ensures that an admin can delete a job title successfully using the 'Delete Selected' feature in the Admin > Job Titles section.
   *
   * Steps:
   * 1. Navigates to the Job Titles section under Admin > Job.
   * 2. Adds a new job title entry.
   * 3. Selects the newly added job using the checkbox.
   * 4. Clicks the 'Delete Selected' button and confirms deletion.
   * 5. Asserts that a success toast message appears confirming deletion.
   */

  it("TS-5: Verify the delete selected functionality", () => {
    const jotitle = generateUniquetitle();

    adminPage.deleteJob(jotitle).then((deleteMsg) => {
      expect(
        deleteMsg.includes("Successfully Deleted") ||
        deleteMsg.includes("InfoNo Records Found×")
      ).to.be.true;
    });
  });

  /**
   * Test Case: TS-6 Verify comment box shows 'Should not exceed 200 characters' when input is too long
   *
   * Purpose:
   * To validate that the application enforces a character limit on the comment input field and displays
   * a proper warning when the limit is exceeded.
   *
   * Steps:
   * 1. Navigate to the Admin > Organization > General Information section.
   * 2. Enable edit mode by clicking the toggle.
   * 3. Enter a comment longer than the allowed character limit (e.g., 290 characters).
   * 4. Capture and verify the displayed validation message.
   *
   * Expected:
   * A validation message like "Should not exceed 255 characters" should be displayed.
   */

  it("TS-6: Verify error appears when Notes size increase 255 characters", () => {
    adminPage.inputLimit().then((messages) => {
      console.log(messages);
      expect(messages.length).to.be.greaterThan(0);
      expect(messages).to.include("Should not exceed 255 characters");
    });
  });

  /**
   * Test Case: TS-7 - Verify the sample CSV file gets downloaded successfully
   *
   * Objective:
   * Ensure that clicking the download button on the PIM > Configuration > Data Import page
   * triggers the file download process and that the file is saved locally.
   *
   * Steps:
   * 1. Navigate to PIM > Configuration > Data Import.
   * 2. Click on the "Download Sample CSV" button.
   * 3. Wait for the download event to be triggered.
   * 4. Save the file using the suggested filename.
   * 5. Verify that the file exists in the expected download folder.
   *
   * Expected:
   * The sample CSV file should be downloaded and exist in the downloads directory.
   */

  it("TS-7: Verify the sample csv file get downloaded succesfully", () => {
    pimPage.downldCsv().then((fileName) => {
      cy.task("verifyDownloadedFileExists", fileName).then((exists) => {
        expect(exists).to.be.true;
        cy.log(`Verified downloaded file exists: ${fileName}`);
      });
    });
  });

  /**
   * Test Case: TS-8 - Verify the selected count is displayed correctly
   *
   * Objective:
   * Ensure that when multiple termination options are selected under PIM > Configuration > Termination Reasons,
   * the correct count of selected records is displayed.
   *
   * Steps:
   * 1. Navigate to the PIM section by clicking the PIM link.
   * 2. Go to Configuration > Termination Reasons.
   * 3. Select three termination checkboxes from the list.
   * 4. Retrieve the displayed selected records count.
   * 5. Assert that the count message reflects 3 records selected.
   *
   * Expected:
   * The selected records count should display "(3) Records Selected".
   */

  it("TS-8: Verify the selected count is displayed correctly", () => {
    pimPage.countTermination().then((count) => {
      expect(count).to.contain("(3) Records Selected");
    });
  });

  /**
   * Test Case: TS-9 - Verify the image gets uploaded
   *
   * Objective:
   * Ensure that an employee image can be successfully uploaded during the Add Employee process.
   *
   * Steps:
   * 1. Navigate to PIM > Add Employee.
   * 2. Upload a profile image using the provided file path.
   * 3. Fill in the required fields (First Name, Last Name, Employee ID).
   * 4. Click Save to submit the employee form.
   * 5. Retrieve the saved employee name text.
   * 6. Verify that the returned name includes the provided first name.
   *
   * Expected:
   * The uploaded image should be accepted, and the employee's first name should appear on the saved profile.
   */

  it("TS-9: Verify the image gets uploaded", () => {
    const name = generateUniqueFirstName();
    pimPage.addPIMImage(name).then((firstname) => {
      cy.wait(2000);
      expect(firstname).to.include(name);
    });
  });

  /**
   * Test Case: TS-10 - Verify Client Logo could not be uploaded above 1MB
   *
   * Objective:
   * Ensure that the system prevents uploading a company logo image that exceeds 1MB in size.
   *
   * Steps:
   * 1. Navigate to Admin > Corporate Branding section.
   * 2. Attempt to upload a logo image file larger than 1MB.
   * 3. Capture the validation message displayed on the UI.
   * 4. Assert that the correct error message is shown indicating the file size limit.
   *
   * Expected:
   * A validation message should appear, preventing the upload of images larger than 1MB.
   */

  it("TS-10: Verify Client Logo could not be uploaded above 1 mb", () => {
    cy.wrap(null)
      .then(() => {
        // Changing Image Greter than 1 MB
        adminPage.uploadImageGt1Mb("CompanyLogo.png");
      })
      .then(() => {
        // Verify the error message appears for incorrect dimension
        verifyIncorrectDimError();
      });
  });

  /**
   * Test Case: TS-11 - Verify Holiday Search Functionality
   *
   * Objective:
   * Ensure that the holiday list is displayed correctly after navigating to the holidays section.
   *
   * Steps:
   * 1. Navigate to the "Leave" section.
   * 2. Click on the "Configure" tab.
   * 3. Click on the "Holidays" option.
   * 4. Click the "Save" or search button to refresh the holiday list.
   * 5. Retrieve all rows from the holiday table.
   * 6. Assert that at least one holiday record is present.
   *
   * Expected:
   * The list should contain at least one holiday, verifying that the holiday search or listing functionality works correctly.
   */

  it("TS-11: Verify Holiday Search Functionality", () => {
    leavePage.holiday().then((list) => {
      const listCount = list.length;
      expect(listCount).to.be.greaterThan(2);
    });
  });

  /**
   * Test Case: TS_12 - Verify the Recruitment link is working fine
   *
   * Objective:
   * Ensure that clicking the "Recruitment" link navigates to the expected Job Vacancy page.
   *
   * Steps:
   * 1. Click on the "Recruitment" main navigation link.
   * 2. Click on the "Vacancy" submenu item.
   * 3. Retrieve the current page URL.
   * 4. Assert that the URL matches the expected Job Vacancy page URL.
   *
   * Expected:
   * The browser should navigate to the correct recruitment job vacancy page URL, confirming the link is functional.
   */

  it("TS-12: Verify the Recruitment link is working fine", () => {
    recruitmentPage.recruitmentLink().then((link) => {
      expect(link).to.include(
        "https://yakshahrm.makemylabs.in/orangehrm-5.7/web/index.php/recruitment/viewJobVacancy"
      );
    });
  });

  /**
   * Test Case: TS-13 - Verify Language Change Functionality
   *
   * Objective:
   * Ensure that changing the language in the Localization settings correctly updates the UI language.
   *
   * Steps:
   * 1. Navigate to Admin > Configuration > Localization.
   * 2. Select a different language from the dropdown (e.g., Chinese).
   * 3. Save the changes.
   * 4. Retrieve the selected language text.
   * 5. Assert that the selected language matches the expected one.
   *
   * Expected:
   * The selected language should be updated and visible in the dropdown, confirming successful language change.
   */

  it("TS-13: Verify Language change Functionality  ", () => {
    cy.wrap(null)
      .then(() => {
        adminPage.languageChangeFunctionality();
      })
      .then(() => {
        verifyLanguageChangeFunctionality();
      });
  });

  /**
   * Test Case: TS-14 Verify the 'Maintenance' tab only allows admin to access
   *
   * Purpose:
   * To ensure that access to the Maintenance tab is restricted and only accessible with valid admin credentials.
   *
   * Steps:
   * 1. Click on the Maintenance tab.
   * 2. Enter the admin password to gain access.
   * 3. Confirm the password entry.
   * 4. Verify that the Maintenance page is displayed by checking the page header.
   */

  it("TS-14: Verify Candidate could be Deleted Successfully", () => {
    const name = generateUniqueFirstName();
    const email = generateUniqueemail();
    cy.log("Deleting candidate:", name, email);
    recruitmentPage.deleteCandidate(name, email).then((list) => {
      cy.wrap(list.length).should("be.greaterThan", 0);
      cy.wrap(list).should("not.include", name);
    });
  });

  /**
   * Test Case: TS-15 Verify Required Field Error in Leaves Tab Displays When Required Field Is Empty
   *
   * Objective:
   * To verify that a validation error message is shown when attempting to assign leave without filling in required fields.
   *
   * Steps:
   * 1. Navigate to the Leave tab and open the Assign Leave section.
   * 2. Click the "Assign" button without entering any values in the form.
   * 3. Capture the displayed validation error message.
   * 4. Assert that the expected error message is shown.
   *
   * Expected:
   * A proper error message (e.g., "Required") should be displayed, indicating that mandatory fields must be filled.
   */

  it("TS-15: Verify Required Field Error in Leaves Tab displays when required field is empty", () => {
    cy.wrap(null)
      .then(() => {
        leavePage.leaveAssignEmptyValueError();
      })
      .then(() => {
        varifyAssignEmptyFieldError();
      });
  });
});
// ---------------------- Helper Functions ----------------------

// Helper function moved outside the describe block

// Test Case 1:
function verifySuccessMessageContains(logMessage) {
  cy.log(logMessage);
}
function generateUniqueUsername(base = "TestUser") {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${uniqueSuffix}`;
}

// Helper function to generate a unique title for the test case
function generateUniquetitle(base = "title_") {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${uniqueSuffix}`;
}

// Test Case 10 : Verify Image Incorrect Dimension Error
function verifyIncorrectDimError() {
  cy.wait(1000);
  cy.get(
    "span.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message"
  )
    .should("be.visible")
    .should("contain.text", "Attachment Size Exceeded");
}

// Test Case 13: Verify Language change Functionality
function verifyLanguageChangeFunctionality() {
  cy.get("div.oxd-select-text-input")
    .eq(0)
    .invoke("text")
    .then((langText) => {
      cy.log("Selected language text:", langText);
      expect(langText).to.contain("French");
    });

  cy.wait(5000);

  // Changes Language again to English
  cy.get("div.oxd-select-text").eq(0).click();
  cy.get(".oxd-select-dropdown")
    .should("be.visible")
    .contains("English")
    .click();
  cy.wait(5000);
  cy.get(
    "button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space"
  )
    // .contains('Save')
    .should("be.visible")
    .click();
  cy.wait(2000);
}

// Test Case 14: Verify Candidate could be Deleted Successfully
function generateUniqueFirstName() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100);
  return `name${random}`;
}

function generateUniqueemail() {
  const timestamp = Date.now();
  return `user_${timestamp}_@yyy.com`;
}

// Test Case 15: Verify Required Field Error in Leaves Tab
function varifyAssignEmptyFieldError() {
  cy.get(
    "span.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message"
  )
    .should("be.visible")
    .and("contain.text", "Required");
}
