import './d2l-single-step-header';
import { css, html, LitElement } from 'lit-element';

class D2LWizard extends LitElement {
	static get properties() {
		return {
			stepTitles: {
				type: Array,
				attribute: 'step-titles'
			},
			stepCount: {
				type: Number,
				attribute: 'step-count'
			},
			selectedStep: {
				type: Number,
				attribute: 'selected-step'
			}
		};
	}

	static get styles() {
		return css`
			.d2l-labs-wizard-header {
				display: flex;
				flex: 1;
				width: 100%;
				justify-content: center;
				margin: 30px 0px;
				overflow-x: auto;
			}
		`;
	}

	constructor() {
		super();

		this.stepTitles = [];
		this.stepCount = 0;
		this.selectedStep = 0;
	}

	render() {
		return html`
			<div class="d2l-labs-wizard-header">
				${this.stepTitles.map((title, index) =>
		html`
						<d2l-labs-single-step-header total-steps="${this.stepCount}" current-step="${index}" selected-step="${this.selectedStep}" title="${title}"></d2l-labs-single-step-header>
					`)}

			</div>
			<slot @slotchange="${this._handleSlotChange}"></slot>
		`;
	}

	next() {
		this.selectedStep = (this.selectedStep + 1) === this.stepCount ? this.selectedStep : (this.selectedStep + 1);

		this._updateStep();

		if (window.parentIFrame) {
			window.parentIFrame.scrollTo(0, 0);
		}

		this._focusAriaTitleOfStep();
	}

	restart() {
		this.selectedStep = 0;

		this._updateStep();

		this._focusAriaTitleOfStep();
	}

	_focusAriaTitleOfStep() {
		const slotChildren = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true }).filter(node => node.nodeType === Node.ELEMENT_NODE);
		slotChildren.forEach(child => {
			if (child.style.display !== 'none') {
				const ariaTitle = child.shadowRoot.getElementById('aria-title');
				if (ariaTitle) {
					ariaTitle.focus();
					return;
				}
			}
		});
	}

	_handleSlotChange() {
		this._updateStep();
	}

	_updateStep() {
		const steps = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);
		this.stepCount = steps.length;

		this.stepTitles = [];

		steps.forEach((element, index) => {
			const title = element.attributes.title;
			this.stepTitles.push(!title ? '' : title.value);
			element.setAttribute('step-count', this.stepCount);
			element.setAttribute('this-step', index + 1);
			element.style.display = index !== this.selectedStep ? 'none' : '';
		});

		this.stepCount = steps.length;
	}

}

customElements.define('d2l-labs-wizard', D2LWizard);
