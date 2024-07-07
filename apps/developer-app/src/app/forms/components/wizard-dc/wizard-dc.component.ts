import { Component, OnInit } from '@angular/core';
import { WizardItem } from '@gosi-ui/core';

@Component({
  selector: 'dev-wizard-dc',
  templateUrl: './wizard-dc.component.html',
  styleUrls: ['./wizard-dc.component.scss']
})
export class WizardDcComponent implements OnInit {
  establishmentWizard: WizardItem[];
  currentTab: number;

  constructor() {}

  ngOnInit(): void {
    this.currentTab = 2;
    this.establishmentWizard = this.getWizards(this.currentTab);
  }
  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number, restrictNextWizards: boolean = false) {
    this.currentTab = tabIndex;
    this.establishmentWizard = this.activateWizard(this.establishmentWizard, tabIndex, restrictNextWizards);
  }

  /**
   * Method to select the wizard.
   * @param wizards
   * @param index
   */
  selectWizard = (wizards: WizardItem[], index: number): WizardItem[] => {
    for (let i = 0; i <= wizards.length - 1; i++) {
      if (i < index) {
        wizards[i].isDone = true;
        wizards[i].isDisabled = false;
        wizards[i].isActive = false;
      } else if (i === index) {
        wizards[i].isDisabled = false;
        wizards[i].isDone = false;
        wizards[i].isActive = true;
      } else {
        wizards[i].isActive = false;
      }
    }
    return [...wizards];
  };

  /**
   * Get Wizards for legal entity
   * @param currentTab
   */
  getWizards = (currentTab?: number): WizardItem[] => {
    const SEC_EST = 'ESTABLISHMENT.SEC-EST-DETAILS';
    const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
    const SEC_OWNER = 'ESTABLISHMENT.SEC-OWNER-DETAILS';
    const faBuilding = 'building';
    const faFileAlt = 'file-alt';
    const faUser = 'user';
    const wizards: WizardItem[] = [];
    let wizard = new WizardItem(SEC_EST, faBuilding);
    wizards.push(wizard);
    wizard = new WizardItem(SEC_OWNER, faUser);
    wizards.push(wizard);
    wizard = new WizardItem(SEC_DOCS, faFileAlt);
    wizards.push(wizard);
    if (currentTab !== undefined) {
      return this.selectWizard(wizards, currentTab);
    } else {
      return wizards;
    }
  };
  activateWizard = (wizards: WizardItem[], index: number, restrictNextWizards: boolean = false): WizardItem[] => {
    if (wizards) {
      for (let i = 0; i <= wizards.length - 1; i++) {
        if (i <= index) {
          wizards[i].isDone = true;
          wizards[i].isDisabled = false;
          wizards[i].isActive = false;
          if (i === index) {
            wizards[i].isActive = true;
            wizards[i].isDone = false;
          }
        } else {
          wizards[i].isActive = false;
          wizards[i].isDone = false;
          if (restrictNextWizards) {
            wizards[i].isDisabled = true;
          }
        }
      }
    }
    return wizards;
  };
}
