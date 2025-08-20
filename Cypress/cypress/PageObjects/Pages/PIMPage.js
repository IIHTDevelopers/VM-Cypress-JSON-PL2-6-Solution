class PIMPage {
  elements = {
    trmintnChkBtn: () =>
      cy.xpath("//i[@class='oxd-icon bi-check oxd-checkbox-input-icon']"),
    terminationTab: () => cy.xpath("//a[text()='Termination Reasons']"),
    configBtn: () => cy.xpath("//span[text()='Configuration ']"),
    PIMLink: () => cy.xpath('//span[text()="PIM"]'),
    addEmpTab: () => cy.xpath("//a[text()='Add Employee']"),
    addImg: () => cy.xpath("//input[@class='oxd-file-input']"),
    empId: () => cy.xpath("//input[@class='oxd-input oxd-input--active']"),
    saveBtn: () => cy.xpath("//button[text()=' Save ']"),
    firstName: () => cy.xpath("//input[@name='firstName']"),
    lastName: () => cy.xpath("//input[@name='lastName']"),
    dataImp: () => cy.xpath("//a[text()='Data Import']"),
    dwnldBtn: () => cy.xpath("//a[text()='Download']"),
  };

  // Test Case 7
  /**
   * Downloads the sample CSV file from the Data Import page and verifies its presence.
   *
   * This method:
   * - Navigates through the PIM module to reach the Data Import section
   * - Initiates the download of a sample CSV file using the visible download button
   * - Uses a custom Cypress task to detect the most recently downloaded file
   * - Asserts that the file exists in the downloads folder
   * - Logs the detected file name and returns it for further validation if needed
   *
   * @returns {Cypress.Chainable<string>} The name of the most recently downloaded CSV file
   */

  downldCsv() {
    const downloadsFolder = Cypress.config("downloadsFolder");

    this.elements.PIMLink().click();
    this.elements.configBtn().click();
    this.elements.dataImp().click();
    cy.wait(1000);

    this.elements.dwnldBtn().should("be.visible").click();
    cy.wait(2000);

    return cy.task("getLatestDownloadedFile").then((fileName) => {
      const filePath = `${downloadsFolder}/${fileName}`;

      cy.readFile(filePath, { timeout: 10000 }).should("exist");

      cy.log(`Downloaded CSV file detected: ${fileName}`);
      return cy.wrap(fileName);
    });
  }

  // Test Case 8
  /**
   * Selects multiple termination reason checkboxes and retrieves the displayed count message.
   *
   * Actions performed:
   * - Navigates to PIM > Configuration > Termination Reasons.
   * - Clicks on the first three termination reason checkboxes.
   * - Extracts the selection count text shown on the page.
   *
   * @returns {Promise<string>} The displayed message showing how many records are selected.
   */
  countTermination() {
    this.elements.PIMLink().click();
    this.elements.configBtn().click();
    this.elements.terminationTab().click();
    for (let i = 1; i < 4; i++) {
      this.elements.trmintnChkBtn().eq(i).click();
    }
    return cy.xpath("//span[@class='oxd-text oxd-text--span']").invoke("text");
  }

  // Test Case 9
  /**
   * Uploads an employee image and adds a new employee record.
   *
   * Actions performed:
   * - Navigates to PIM > Add Employee.
   * - Uploads a profile image.
   * - Fills in First Name, Last Name, and Employee ID fields.
   * - Submits the form by clicking Save.
   * - Waits for the profile page to load and extracts the displayed employee name.
   *
   * @param {string} firstName - The first name to use for the new employee.
   * @returns {Promise<string[]>} An array containing the full name displayed on the profile page.
   */
  addPIMImage(firstName) {
    this.elements.PIMLink().click();
    this.elements.addEmpTab().click();
    cy.wait(3000);
    this.elements
      .addImg()
      .eq(0)
      .should("exist")
      .selectFile("cypress/fixtures/TestImage.jpg", { force: true });
    cy.wait(6000);
    this.elements.firstName().type(firstName);
    this.elements.lastName().type("lastname");
    this.elements.empId().eq(1).type(firstName);
    this.elements.saveBtn().click();
    cy.wait(15000);
    return cy
      .get("input.oxd-input.oxd-input--active.orangehrm-firstname")
      .invoke("val");
  }
}

export default PIMPage;
