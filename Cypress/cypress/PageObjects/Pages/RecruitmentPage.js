class RecruitmentPage {
  elements = {
    recruitmentTab: () => cy.xpath("//span[text()='Recruitment']"),
    vacancyTab: () => cy.xpath("//a[text()='Vacancies']"),
    candidateTab: () => cy.xpath("//a[text()='Candidates']"),
    addBtn: () => cy.xpath("//button[text()=' Add ']"),
    deleteConfirmation: () => cy.xpath("//button[text()=' Yes, Delete ']"),
    deleteBtn: () => cy.xpath("//i[@class='oxd-icon bi-trash']"),
    saveButton: () => cy.xpath("//button[text()=' Save ']"),
    emailInput: () => cy.xpath("//input[@placeholder='Type here']"),
    firstName: () => cy.xpath("//input[@name='firstName']"),
    lastName: () => cy.xpath("//input[@name='lastName']"),
    candidateRow: (name) => cy.contains("tr", name),
    candidateTable: () => cy.get("table"),
  };

  // Test Case 12
  /**
   * Navigates to the Recruitment > Vacancy section and returns the current page URL.
   *
   * Steps performed:
   * - Clicks on the "Recruitment" main link.
   * - Waits for the page to load.
   * - Clicks on the "Vacancy" tab.
   * - Waits for the vacancy page to load.
   * - Returns the current page URL.
   *
   * @returns {Promise<string>} The URL of the recruitment vacancy page.
   */

  recruitmentLink() {
    this.elements.recruitmentTab().click();
    cy.wait(2000);

    this.elements.vacancyTab().click();
    cy.wait(1000);

    return cy.url();
  }

  // Test Case 14
  /**
   * Creates a new candidate and deletes it from the Candidates list.
   *
   * This method:
   * - Navigates to the Recruitment > Candidates section
   * - Adds a new candidate with the provided `name` and `email`
   * - Saves the candidate and returns to the Candidates list
   * - Deletes the most recently added candidate using the first delete icon
   * - Confirms deletion through the confirmation dialog
   * - Returns the name(s) of the first candidate(s) currently visible in the list
   *
   * @param {string} name - The first name of the candidate to add and delete
   * @param {string} email - The email address of the candidate
   * @returns {Cypress.Chainable<string[]>} The names of candidates in the top row after deletion
   */

  deleteCandidate(name, email) {
    cy.get("a").contains("Recruitment").click();
    cy.wait(2000);

    cy.get("a").contains("Candidates").click();

    cy.get("button").contains("Add").click();
    cy.wait(2000);

    cy.get('input[name="firstName"]').type(name);
    cy.get('input[name="lastName"]').type("lastname");
    cy.xpath(
      "//label[text()='Email']/following::input[@placeholder='Type here'][1]"
    )
      .should("be.visible")
      .type(email);

    cy.get("button").contains("Save").click();
    cy.wait(7000);

    cy.get("a").contains("Candidates").click();
    cy.wait(6000);

    cy.xpath("(//i[contains(@class, 'bi-trash')])[1]")
      .should("be.visible")
      .click();

    cy.get("button").contains("Yes, Delete").click();
    cy.wait(6000);

    return cy.xpath("//div[@role='row'][1]/div[3]/div").then(($els) => {
      return Cypress._.map($els, "innerText");
    });
  }
}

export default RecruitmentPage;
