import { eventBus } from "./event-bus";
import { Response } from "./api";

export const Events = {
	SHOW_ERROR_MODAL: "SHOW_ERROR_MODAL",

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
	}
};
