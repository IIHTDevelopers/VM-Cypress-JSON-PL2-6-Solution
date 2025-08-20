class LeavesPage {
  elements = {
    leaveTab: () => cy.contains("span.oxd-main-menu-item--name", "Leave"),
    configureDropdown: () =>
      cy.get(".oxd-topbar-body-nav-tab-item").contains("Configure"),
    holidayButton: () =>
      cy.get("a.oxd-topbar-body-nav-tab-link").contains("Holiday"),
    addHolidayButton: () =>
      cy
        .get("button.oxd-button.oxd-button--medium.oxd-button--secondary")
        .contains("Add"),
    nameInput: () =>
      cy
        .contains("label", "Name")
        .parent()
        .siblings("div")
        .find("input.oxd-input")
        .type("Your Holiday Name"),
    dateInput: () => cy.get('input.oxd-input[placeholder="yyyy-mm-dd"]'),
    fullDayDropdown: () =>
      cy.get(".oxd-select-text-input").contains("Full Day"),
    fullDayOption: (option) => cy.get(".oxd-select-dropdown").contains(option),
    saveButton: () => cy.get('button[type="submit"]').contains("Save"),
    finalList: () => cy.get(".orangehrm-container").find(".oxd-table-cell"),
    workWeekButton: () =>
      cy.get("a.oxd-topbar-body-nav-tab-link").contains("Work Week"),
    mondayButton: () => cy.get("div.oxd-select-text.oxd-select-text--active"),
    halfDayOption: () => cy.get(".oxd-select-dropdown").contains("Half Day"),
    weekDaySaveButton: () =>
      cy
        .get(
          "button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space"
        )
        .contains("Save"),
    assignLeaveButton: () =>
      cy.get("li.oxd-topbar-body-nav-tab").contains("Assign Leave"),
    assignSubmitButton: () =>
      cy
        .get(
          "button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space"
        )
        .contains("Assign"),
  };

  // Test Case 11
  /**
   * Navigates to the Holidays configuration section and retrieves the list of holiday entries.
   *
   * Steps performed:
   * - Clicks on the "Leave" menu.
   * - Navigates to the "Configure" -> "Holidays" tab.
   * - Clicks the Save/Search button to load holiday data.
   * - Returns the list of holiday names or dates as displayed in the second column.
   *
   * @returns {Promise<string[]>} A list of strings representing the holidays listed in the table.
   */

  holiday() {
    cy.xpath("//span[text()='Leave']").click();
    cy.wait(2000);

    cy.xpath("//span[text()='Configure ']").click();
    cy.xpath("//a[text()='Holidays']").click();
    cy.xpath("//button[text()=' Search ']").click();
    cy.wait(4000);
    return cy.xpath("//div[@role='row']/div[2]").then(($els) => {
      return Cypress._.map($els, "innerText");
    });
  }

  // Test Case 15:
  /**
   * Attempts to assign leave without filling required fields and returns the resulting error message.
   *
   * Steps performed:
   * - Clicks on the Leave menu.
   * - Opens the Assign Leave tab.
   * - Clicks the "Assign" button without entering any field values.
   * - Captures and returns the first validation error message shown.
   *
   * @returns {Promise<string>} The validation error message displayed (e.g., "Required").
   */
  leaveAssignEmptyValueError() {
    this.elements.leaveTab().click();

    this.elements.assignLeaveButton().click();

    this.elements.assignSubmitButton().click();
  }
}

export default LeavesPage;
