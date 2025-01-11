import { eventBus } from "./event-bus";
import { Response } from "./api";

export const Events = {
  SHOW_ERROR_MODAL: "SHOW_ERROR_MODAL",
  USER_SIGNED_IN: "USER_SIGNED_IN",
  USER_SIGNED_OUT: "USER_SIGNED_OUT",
  SHOW_CONFIRMABLE_MODAL: "SHOW_CONFIRMABLE_MODAL",
  HOME_PAGE_CLICKED: "HOME_PAGE_CLICKED",

  showErrorModal(errors: string[]) {
    eventBus.publish({ type: this.SHOW_ERROR_MODAL, data: errors });
  },
  showErrorModalOrRun(response: Response, onSuccess: Function) {
    if (response.success) {
      onSuccess();
    } else {
      this.showErrorModal(response.errors());
    }
  },
  showErroModalIfFailure(response: Response) {
    this.showErrorModalOrRun(response, () => { });
  },
  showConfirmableModal(modalId = "") {
    eventBus.publish({ type: this.SHOW_CONFIRMABLE_MODAL, data: modalId });
  },
  userSignedIn() {
    eventBus.publish({ type: this.USER_SIGNED_IN });
  },
  userSignedOut() {
    eventBus.publish({ type: this.USER_SIGNED_OUT });
  },
  homePageClicked() {
    eventBus.publish({ type: this.HOME_PAGE_CLICKED });
  }
};
