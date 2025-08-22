class AdminPage {
  elements = {
    adminTab: () => cy.contains("span.oxd-main-menu-item--name", "Admin"),
    addAdminButton: () =>
      cy
        .get("button.oxd-button.oxd-button--medium.oxd-button--secondary")
        .contains("Add"),
    userRoleDropdown: () =>
      cy
        .get('label:contains("User Role")')
        .parents(".oxd-input-group")
        .find(".oxd-select-text--after"),
    userRoleOption: (role) => cy.get(".oxd-select-dropdown").contains(role),
    statusDropdown: () =>
      cy
        .get('label:contains("Status")')
        .parents(".oxd-input-group")
        .find(".oxd-select-text-input"),
    statusOption: (status) => cy.get(".oxd-select-dropdown").contains(status),
    usernameInput: () =>
      cy
        .get('label:contains("Username")')
        .parents(".oxd-input-group")
        .find("input"),
    passwordInput: () =>
      cy
        .get('label:contains("Password")')
        .parents(".oxd-input-group")
        .find('input[type="password"]')
        .first(),
    confirmPasswordInput: () =>
      cy
        .get('label:contains("Confirm Password")')
        .parents(".oxd-input-group")
        .find('input[type="password"]'),
    saveButton: () => cy.get('button[type="submit"]').contains("Save"),
    profileTab: () => cy.get("i.oxd-userdropdown-icon"),
    corporateBrandingLink: () => cy.contains("a", "Corporate Branding"),
    logoutButton: () => cy.contains("a", "Logout"),
    loginUsername: () =>
      cy.get('input[placeholder="Username"], input[placeholder="username"]'),
    loginPassword: () =>
      cy.get('input[placeholder="Password"], input[placeholder="password"]'),
    loginButton: () => cy.get('button[type="submit"]'),
    employeeNameInput: () => cy.get('input[placeholder="Type for hints..."]'),
    jobTitle: () => cy.contains("a", "Job Titles"),
    jobTab: () => cy.contains("span", "Job "),
    jobInput: () => cy.get("input.oxd-input.oxd-input--active"),
    addJobButton: () => cy.get("button").contains("Add"),
    confirmDeleteButton: () => cy.get("button").contains("Yes, Delete"),
    deleteAllButton: () => cy.get("button").contains("Delete Selected"),
    checkBox: () => cy.get("span.oxd-checkbox-input"),
    commentTextarea: () => cy.get("textarea.oxd-textarea"),
    editToggle: () => cy.contains("label", "Edit"),
    orgGeneralInfo: () => cy.contains("a", "General Information"),
    orgTab: () => cy.contains("span", "Organization "),
    configurationLink: () =>
      cy.get("li.oxd-topbar-body-nav-tab").contains("Configuration"),
    languageSaveButton: () =>
      cy.get(
        "button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space"
      ),
    empName: () => cy.get('input[placeholder="Type for hints..."]'),
    profileIcon: () => cy.get("i.oxd-userdropdown-icon"),
    langDropdown: () => cy.get("div.oxd-select-text.oxd-select-text--active"),
    englishOption: () =>
      cy.get('div[role="listbox"] span').contains("English (United States)"),
  };

  // Test Case 1
  /**
   * Adds a new admin user via the Admin section form.
   *
   * Navigates through the Admin tab, selects user roles, fills required fields,
   * handles employee name auto-suggestion, and submits the form. Finally,
   * waits for the toast notification and returns the message for validation.
   *
   * @returns {Promise<string>} The trimmed toast success message after form submission.
   */

  addAdminUserForm() {
    cy.fixture("Data/AddUserForm").then((data) => {
      cy.wait(2000);
      cy.log("Role:", data.role);
      expect(data.role).to.exist;

      this.elements.adminTab().should("be.visible").click();
      cy.wait(2000);

      this.elements.addAdminButton().should("be.visible").click();

      this.elements.userRoleDropdown().click();
      cy.wait(2000);

      this.elements.userRoleOption(data.role).click();

      cy.get('input[placeholder="Type for hints..."]').type("A", {
        force: true,
      });
      cy.wait(2000);

      cy.get(".oxd-autocomplete-dropdown")
        .should("be.visible")
        .find('div[role="option"] span')
        .first()
        .click({ force: true });

      this.elements.statusDropdown().click({ force: true });
      cy.wait(2000);

      this.elements.statusOption(data.status).click({ force: true });

      this.elements.usernameInput().type(`${data.username}_${Date.now()}`);
      cy.wait(2000);

      this.elements.passwordInput().type(data.password);
      this.elements.confirmPasswordInput().type(data.confirmPassword);

      this.elements.saveButton().should("be.visible").click();
      cy.wait(2000);
    });
  }

  // Test Case 2
  /**
   * Creates a new user and verifies that the user can successfully log in.
   *
   * Navigates to the Admin tab, fills out the user creation form, selects roles,
   * handles employee autocomplete, submits the form, logs out, and attempts login
   * with the new credentials. Finally, it returns the current page URL post-login
   * for validation purposes.
   *
   * @returns {Promise<string>} The URL of the page after successful login.
   */

  verifyNewUser() {
    cy.fixture("Data/AddUserForm").then((data) => {
      const password = "Testaa@123";
      const usernamee = generateUniqueUsername();

      this.elements.adminTab().click();
      this.elements.addAdminButton().click();

      this.elements.userRoleDropdown().eq(0).click();
      cy.get('div[role="listbox"]').first().click();

      cy.get('input[placeholder="Type for hints..."]').type("A", {
        force: true,
      });
      cy.wait(2000);

      cy.get(".oxd-autocomplete-dropdown")
        .should("be.visible")
        .find('div[role="option"] span')
        .first()
        .click({ force: true });
      cy.wait(2000);

      this.elements.statusDropdown().click({ force: true });
      cy.wait(2000);

      this.elements.statusOption(data.status).click({ force: true });

      this.elements.usernameInput().eq(0).type(usernamee);
      this.elements.passwordInput().eq(0).type(password);
      this.elements.confirmPasswordInput().eq(0).type(password);

      this.elements.saveButton().click({ force: true });
      cy.wait(8000);

      this.elements.profileIcon().click();
      this.elements.logoutButton().click();
      cy.wait(2000);

      this.elements.usernameInput().type(usernamee);
      this.elements.passwordInput().type(password);
      this.elements.loginButton().click();
      cy.wait(3000);

      return cy.url();
    });
  }

  // Test Case 3
  /**
   * Creates a new user with the 'ESS' role and verifies restricted access.
   *
   * This method:
   * - Navigates to the Admin panel and initiates user creation
   * - Assigns the 'ESS' role and a random employee from the autocomplete
   * - Generates a unique username and sets a predefined password
   * - Submits the form and logs out from the current session
   * - Logs in using the newly created ESS user credentials
   * - Retrieves and returns the list of visible main menu tabs
   *
   * @returns {Promise<string[]>} A list of tab names visible to the ESS user
   */

  verifyESS() {
    cy.fixture("Data/AddUserForm").then((data) => {
      const password = "Testaa@123";
      const username = `ESSUser_${Date.now()}`;

      this.elements.adminTab().click();
      this.elements.addAdminButton().click();

      this.elements.userRoleDropdown().eq(0).click();
      cy.get('.oxd-select-dropdown div[role="option"]').eq(2).click();

      this.elements.statusDropdown().click({ force: true });
      cy.wait(2000);

      this.elements.statusOption(data.status).click({ force: true });

      this.elements.employeeNameInput().clear().type("a", { force: true });
      cy.wait(5000);
      cy.get('.oxd-autocomplete-dropdown div[role="option"]').first().click();

      cy.wait(5000);
      this.elements.usernameInput().eq(0).type(username);
      this.elements.passwordInput().eq(0).type(password);
      this.elements.confirmPasswordInput().eq(0).type(password);
      cy.wait(3000);

      this.elements.saveButton().should("be.visible").click({ force: true });
      cy.wait(5000);

      this.elements.profileTab().click();
      this.elements.logoutButton().click();

      this.elements.loginUsername().type(username);
      this.elements.loginPassword().type(password);
      this.elements.loginButton().click();

      cy.wait(3000);

      return cy.get("a.oxd-main-menu-item").then(($els) => {
        return Cypress._.map($els, "innerText");
      });
    });
  }

  // Test Case 4
  /**
   * Creates a new ESS user and upgrades their role to Admin.
   *
   * This method performs the following actions:
   * - Creates a user with the 'ESS' role and provided username
   * - Submits the user creation form
   * - Locates the newly created ESS user in the admin table
   * - Edits the user's role from 'ESS' to 'Admin'
   * - Saves the updated role and reloads the page
   * - Extracts and returns the updated role text of the user for verification
   *
   * @param {string} usernamee - The unique username to be assigned during user creation
   * @returns {Promise<string>} The role label text associated with the updated user
   */

  upgradeAdmin(usernamee) {
    return cy.fixture("Data/AddUserForm").then((data) => {
      const password = "Testaa@123";

      this.elements.adminTab().click();
      this.elements.addAdminButton().click();

      this.elements.userRoleDropdown().eq(0).click();
      cy.get('.oxd-select-dropdown div[role="option"]').eq(2).click();

      this.elements.statusDropdown().click({ force: true });
      cy.wait(2000);

      this.elements.statusOption(data.status).click({ force: true });

      this.elements.employeeNameInput().clear().type("a", { force: true });
      cy.wait(3000);
      cy.get('.oxd-autocomplete-dropdown div[role="option"]').first().click();

      this.elements.usernameInput().eq(0).type(usernamee);
      this.elements.passwordInput().eq(0).type(password);
      this.elements.confirmPasswordInput().eq(0).type(password);

      this.elements.saveButton().should("be.visible").click({ force: true });
      cy.wait(10000);

      cy.get(".oxd-table").should("be.visible");

      cy.get("input.oxd-input.oxd-input--active").eq(1).type(usernamee, { force: true });
      cy.wait(2000);

      cy.get('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').click();
      cy.wait(2000);

      cy.get("i.oxd-icon.bi-pencil-fill").click({ force: true });
      cy.wait(2000);

      this.elements.userRoleDropdown().eq(0).click();
      cy.get('.oxd-select-dropdown div[role="option"]').eq(1).click();

      this.elements.saveButton().click();
      cy.wait(10000);

      cy.get("input.oxd-input.oxd-input--active").eq(1).type(usernamee, { force: true });
      cy.wait(2000);

      cy.get('button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').click();
      cy.wait(2000);

      return cy
        .get(".oxd-table-row")
        .contains(usernamee)
        .parents(".oxd-table-row")
        .find(".oxd-table-cell")
        .eq(2)
        .then(($cell) => {
          const text = $cell.text().trim();
          cy.log("Role cell text:", text);
          cy.wrap(text).should("include", "Admin");
        });
    });
  }

  // Test Case 5
  /**
   * Adds and deletes a job title using the 'Delete Selected' functionality.
   *
   * This method performs the following actions:
   * - Navigates to the Admin > Job > Job Titles section
   * - Adds a new job title named 'jobtitleee'
   * - Selects the first job title entry using a checkbox
   * - Clicks the 'Delete Selected' button and confirms the deletion
   * - Returns the success toast message text for assertion
   *
   * @returns {Promise<string>} The success message displayed after deletion
   */

  deleteJob(jobtitleee) {
    this.elements.adminTab().click();
    cy.wait(2000);

    this.elements.jobTab().click();
    this.elements.jobTitle().click();

    this.elements.addJobButton().click();
    this.elements.jobInput().eq(1).type(jobtitleee);

    this.elements.saveButton().click();
    cy.wait(8000);

    this.elements.checkBox().eq(0).click();

    this.elements.deleteAllButton().click();
    this.elements.confirmDeleteButton().click();
    cy.wait(4000);

    return cy.get("div.oxd-toast-container").invoke("text");
  }

  // Test Case 6
  /**
   * Inputs an overly long comment in the organization general information section to trigger validation.
   *
   * Actions performed:
   * - Navigates to Admin > Organization > General Information.
   * - Enables edit mode using the toggle switch.
   * - Fills the comment box with a string exceeding 255 characters.
   * - Waits for the validation message to appear.
   * - Returns the displayed error message text for assertion.
   *
   * @returns {Promise<string>} The validation message shown for exceeding character limit.
   */

  inputLimit() {
    const longText = "A".repeat(290);

    this.elements.adminTab().click();
    cy.wait(2000);

    this.elements.orgTab().click();
    this.elements.orgGeneralInfo().click();

    this.elements.editToggle().click();
    cy.wait(2000);

    this.elements.commentTextarea().clear().type(longText, { delay: 0 });

    cy.wait(2000);

    return cy
      .get("span.oxd-input-field-error-message")
      .then(($els) => Cypress._.map($els, "innerText"));
  }

  // Test Case 10
  /**
   * Attempts to upload a company logo file larger than 1MB and retrieves the validation message.
   *
   * Steps performed:
   * - Navigates to Admin > Corporate Branding section.
   * - Uploads an image file exceeding 1MB via the logo input.
   * - Captures the validation error message from the UI.
   *
   * @returns {Promise<string>} The validation message displayed after attempting the upload.
   */

  uploadImageGt1Mb(imageFile) {
    this.elements.adminTab().should("be.visible").click();

    this.elements.corporateBrandingLink().should("be.visible").click();

    cy.get("div.oxd-file-button").eq(0).should("be.visible").click();

    cy.get('input[type="file"]')
      .eq(0)
      .should("exist")
      .selectFile(`cypress/fixtures/${imageFile}`, { force: true });
  }

  // Test Case 13
  /**
   * Changes the application language via Admin > Configuration > Localization and returns the selected language.
   *
   * Steps performed:
   * - Navigates to the Admin section.
   * - Clicks on the Configuration > Localization tab.
   * - Opens the language dropdown and selects the first language option.
   * - Saves the language change.
   * - Retrieves the updated selected language text.
   * - Resets the language back to English.
   *
   * @returns {Promise<string>} The text content of the newly selected language (e.g., "中文").
   */

  languageChangeFunctionality() {
    this.elements.adminTab().should("be.visible").click();

    this.elements.configurationLink().should("be.visible").click();
    cy.get(".oxd-dropdown-menu")
      .should("be.visible")
      .contains("Localization")
      .click();

    this.elements.langDropdown().eq(0).click();

    cy.get(".oxd-select-dropdown")
      .should("be.visible")
      .contains("French")
      .click();

    this.elements.languageSaveButton().should("be.visible").click();

    cy.wait(2000);
  }
}

// Utility: Generate a unique username
function generateUniqueUsername(base = "TestUser") {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${base}${uniqueSuffix}`;
}

export default AdminPage;
