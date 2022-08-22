import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ComponentStyles from '../styles/ComponentStyles';
import { check_icon } from '../icons/Check.icon.js';
import { indeterminate_icon } from '../icons/Indeterminate.icon.js';

/**
 * A control that allows a user to check a value on or off.
 *
 * ```js 
 * import '@innofake/omni-components/check'; 
 * ```
 * 
 * @example
 * 
 * ```html
 * <omni-check
 *   label="My Toggle Value"
 *   .data="{'id': 12345, 'name': 'Test'}"
 *   hint="Required"
 *   error="Field level error message"
 *   checked
 *   disabled>
 * </omni-check>
 * ```
 * 
 * @element omni-check
 * 
 * Registry of all properties defined by the component.
 * 
 * @property {String} [label] - The label text.
 * @property {Object} [data] - Data associated with the component.
 * 
 * @property {String} [hint] - A hint message to assist the user.
 * @property {String} [error] - An error message to guide users to correct a mistake.
 * 
 * @property {Boolean} [checked=false] - Indicator if the component is checked or not.
 * @property {Boolean} [disabled=false] - Indicator if the component is disabled.
 * @property {Boolean} [indeterminate=false] - Indicator if the component is in and indeterminate state.
 * 
 * @slot indeterminate_icon - Replaces the icon for the indeterminate state
 * @slot check_icon - Replaces the icon for the checked state
 * 
 * @fires {CustomEvent<{ old: Boolean; new: Boolean; }>} value-change - Dispatched when the control value is changed to either on or off.
 * 
 * @cssprop --omni-check-label-font-color - Label font color.
 * @cssprop --omni-check-label-font-family - Label font family.
 * @cssprop --omni-check-label-font-size - Label font size.
 * @cssprop --omni-check-label-font-weight - Label font weight.
 * @cssprop --omni-check-label-spacing - Label spacing.
 * 
 * @cssprop --omni-check-input-hint-label-font-color - Hint font color.
 * @cssprop --omni-check-input-hint-label-font-family - Hint font family.
 * @cssprop --omni-check-input-hint-label-font-size - Hint font size.
 * @cssprop --omni-check-input-hint-label-font-weight - Hint font weight.
 * 
 * @cssprop --omni-check-input-error-label-font-color - Error font color.
 * @cssprop --omni-check-input-error-label-font-family - Error font family.
 * @cssprop --omni-check-input-error-label-font-size - Error font size.
 * @cssprop --omni-check-input-error-label-font-weight - Error font weight.
 * 
 * @cssprop --omni-check-width - Width.
 * @cssprop --omni-check-height - Height.
 * @cssprop --omni-check-background-color - Background color.
 * 
 * @cssprop --omni-check-border-width - Border width.
 * @cssprop --omni-check-border-color - Border color.
 * @cssprop --omni-check-border-radius - Border radius.
 * 
 * @cssprop --omni-check-indicator-border-width - Indicator Border width.
 * @cssprop --omni-check-indicator-border-color - Indicator Border color.
 * @cssprop --omni-check-indicator-color - Indicator color.
 * 
 * @cssprop --omni-check-checked-background-color - Checked Background color.
 * @cssprop --omni-check-indeterminate-background-color - Indeterminate Background color.
 * @cssprop --omni-check-disabled-background-color - Disabled Background color.
 * @cssprop --omni-check-disabled-border-color - Disabled border color.
 * 
 * @cssprop --omni-check-hover-box-shadow - Hover box shadow.
 * @cssprop --omni-check-hover-background-color - Hover background color.
 * 
 */
@customElement('omni-check')
export class Check extends LitElement {

	@property({ type: String, reflect: true }) label?: string;
	@property({ type: Object, reflect: true }) data?: object;
	@property({ type: String, reflect: true }) hint?: string;
	@property({ type: String, reflect: true }) error?: string;
	@property({ type: Boolean, reflect: true }) checked = false;  
	@property({ type: Boolean, reflect: true }) disabled = false;  
	@property({ type: Boolean, reflect: true }) indeterminate = false;  

	// --------------
	// INITIALISATION
	// --------------

	/**
	 * @hideconstructor
	 */
     constructor() {

		super();
	}

	// ------------------
	// LIFECYCLE HANDLERS
	// ------------------

	override connectedCallback(): void {
		super.connectedCallback();
		this.tabIndex = this.disabled ? -1 : 0;

		this.addEventListener(`click`, this._click);
	}

	// ----------------
	// PUBLIC FUNCTIONS
	// ----------------	

	override focus() {
		this.shadowRoot.getElementById(`content`).focus();
	}

	// --------------
	// EVENT HANDLERS
	// --------------

	/**
	 * Handles click events.
	 * 
	 * @param {MouseEvent} e - The event details.
	 * 
	 * @ignore
	 * @returns {void}
	 */
	_click(e: MouseEvent): void {

		// Ignore the event if the component is disabled.
		if (this.disabled) {
			return e.stopImmediatePropagation();
		}

		this._toggleChecked(e);
	}

	/**
	 * Handles key down events.
	 * 
	 * @param {KeyboardEvent} e - The event details.
	 *
	 * @ignore
	 * @returns {void}
	 */
	_keyDown(e: KeyboardEvent): void {

		if (this.disabled) {
			return e.stopImmediatePropagation();
		}

		// Intercept space and enter key events to toggle the component checked state.
		const keyCode = (e.code || ``).toUpperCase();

		if (keyCode === `SPACE` || keyCode === `ENTER`) {

			// Toggle the component checked state.
			this._toggleChecked(e);

			// Prevent the key event from propagating further.
			return e.preventDefault();
		}
	}

	// ---------------
	// PRIVATE METHODS
	// ---------------

	/**
	 * Toggles the current checked state of the component.
	 * 
	 * @param {MouseEvent | KeyboardEvent} e - The event details.
	 * 
	 * @ignore
	 * @returns {void}
	 */
	_toggleChecked(e: MouseEvent|KeyboardEvent): void {

		const oldValue = this.checked;
		this.checked = !oldValue;

		this.dispatchEvent(new CustomEvent(`value-changed`, {
			detail: {
				old: oldValue,
				new: this.checked
			}
		}));

		this.dispatchEvent(new CustomEvent(`value-change`, {
			detail: {
				old: oldValue,
				new: this.checked
			}
		}));

		e.stopPropagation();
	}

	// -------------------
	// RENDERING TEMPLATES
	// -------------------

	/**
	 * The element style template.
	 * 
	 */
	static override get styles() {

		return [
			ComponentStyles,
			css`
				:host {
					outline: none;
				}

				/* CONTAINER STYLES */

				.container {
					display: flex;
					align-items: center;
				}

				/* LABEL STYLES */
				
				.container > .label {
					color: var(--omni-check-label-font-color, var(--omni-colored-font-color));
					font-family: var(--omni-check-label-font-family, var(--omni-font-family));
					font-size: var(--omni-check-label-font-size, 14px);
					font-weight: var(--omni-check-label-font-weight, 300);

					margin-left: var(--omni-check-label-spacing, 8px);

					cursor: pointer;
				}

				.container > .label > .hint {
					color: var(--omni-check-input-hint-label-font-color, var(--omni-hint-font-color));
					font-family: var(--omni-check-input-hint-label-font-family, var(--omni-font-family));
					font-size: var(--omni-check-input-hint-label-font-size, 12px);
					font-weight: var(--omni-check-input-hint-label-font-weight, 300);

					padding-top: 4px;
				}

				.container > .label > .error {
					color: var(--omni-check-input-error-label-font-color, var(--omni-error-font-color));
					font-family: var(--omni-check-input-error-label-font-family, var(--omni-font-family));
					font-size: var(--omni-check-input-error-label-font-size, 12px);
					font-weight: var(--omni-check-input-error-label-font-weight, 300);

					padding-top: 4px;
				}

				/* CHECK BOX STYLES */

				.container > #content {
					box-sizing: border-box;
					cursor: pointer;

					display: flex;
					align-items: center;
					justify-content: center;

					width: var(--omni-check-width, 22px);
					height: var(--omni-check-height, 22px);

					background-color: var(--omni-check-background-color, var(--omni-light-background-color));

					border-width: var(--omni-check-border-width, 2px);
					border-style: solid;
					border-color: var(--omni-check-border-color, var(--omni-filled-background-color));
					border-radius: var(--omni-check-border-radius, 4px);
					
					outline: 0;
				}

				.indicator {
					width: 100%;
					height: 100%;
				}
				
				.container.checked > #content > .indicator {

					border-width: var(--omni-check-indicator-border-width, 1px);
					border-style: solid;
					border-color: var(--omni-check-indicator-border-color, var(--omni-filled-background-color));
					border-radius: var(--omni-check-border-radius, 4px);

					color: var(--omni-check-indicator-color, var(--omni-light-background-color));

					display: flex;
					align-items: center;
					justify-content: center;

					fill: currentColor;
				}
				
				/* CHECKED STATE STYLES */

				.container.checked > #content {
					background-color: var(--omni-check-checked-background-color, var(--omni-filled-background-color));
				}
				/* INDETERMINATE STATE STYLES */

				.container.indeterminate > #content {
					background-color: var(--omni-check-indeterminate-background-color, var(--omni-filled-background-color));
					color: var(--omni-check-indicator-color, var(--omni-light-background-color));
				}
				
				.container.indeterminate > #content > .indicator {

					color: var(--omni-check-indicator-color, var(--omni-light-background-color));
					fill: currentColor;
				}
				
				/* HOVER STATE STYLES */

				.container > #content:hover {
					box-shadow: var(--omni-check-hover-box-shadow,0 0 4px 4px var(--omni-light-box-shadow-color));
					background-color: var(--omni-check-hover-background-color,var(--omni-light-box-shadow-color));
				}

				.container.checked:hover > #content {
					background-color: var(--omni-check-checked-background-color, var(--omni-filled-background-color));
				}

				.container.checked.disabled:hover > #content {
					background-color: var(--omni-check-disabled-background-color, var(--omni-disabled-background-color));
				}
				
				.container.indeterminate:hover > #content {
					background-color: var(--omni-check-indeterminate-background-color, var(--omni-filled-background-color));
				}

				.container.disabled.indeterminate:hover > #content {
					background-color: var(--omni-check-disabled-background-color, var(--omni-disabled-background-color));					
				}

				/* DISABLED STATE STYLES */

				.container.disabled > #content {
					cursor: default;
					border-color: var(--omni-check-disabled-border-color, var(--omni-disabled-background-color));
					background-color: var(--omni-check-disabled-background-color, var(--omni-disabled-background-color));
				}

				.container.disabled:hover > #content {
					box-shadow: none;
				}

				.container.checked.disabled > #content > .indicator {
					border-color: transparent;
				}
			`
		];
	}

	/**
	 * Apply changes to the element DOM when a property value changes.
	 * 
	 * @returns {TemplateResult} The updated DOM template.
	 */
	override render(): TemplateResult {
		return html`
			<div 
				class="container${this.indeterminate ? ` indeterminate` : this.checked ? ` checked` : ``}${this.disabled ? ` disabled` : ``}">
				<div
					id="content"
					@keydown="${this._keyDown}">
					<div class="indicator">${this.indeterminate ? html`<slot name="indeterminate_icon">${indeterminate_icon()}</slot>` : this.checked ? html`<slot name="check_icon">${check_icon()}</slot>` : ``}</div>
				</div>

				<label class="label">
					${this.label}
					${this.hint && !this.error ? html`<div class="hint">${this.hint}</div>` : ``}
					${this.error ? html`<div class="error">${this.error}</div>` : ``}
				</label>
			</div>
		`;
	}
}