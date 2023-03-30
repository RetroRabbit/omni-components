import { waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { setUIValueClean } from '@testing-library/user-event/dist/esm/document/UI.js';
import * as jest from 'jest-mock';
import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { LabelStory, BaseArgs, HintStory, ErrorStory, DisabledStory, ValueStory, PrefixStory, SuffixStory } from '../core/OmniInputStories.js';
import { ifNotEmpty } from '../utils/Directives.js';
import expect from '../utils/ExpectDOM.js';
import { assignToSlot, ComponentStoryFormat, CSFIdentifier } from '../utils/StoryUtils.js';
import { PinField } from './PinField.js';

import './PinField.js';
import '../icons/Check.icon.js';
import '../icons/LockOpen.icon.js';
import '../icons/LockClosed.icon.js';

export default {
    title: 'UI Components/Pin Field',
    component: 'omni-pin-field'
} as CSFIdentifier;

interface Args extends BaseArgs {
    hide: string;
    show: string;
}

export const Interactive: ComponentStoryFormat<Args> = {
    render: (args: Args) => html`
    <omni-pin-field
      data-testid="test-pin-field"
      label="${ifNotEmpty(args.label)}"
      value="${args.value}"
      hint="${ifNotEmpty(args.hint)}"
      error="${ifNotEmpty(args.error)}"
      ?disabled="${args.disabled}">${args.prefix ? html`${'\r\n'}${unsafeHTML(assignToSlot('prefix', args.prefix))}` : nothing}${
        args.suffix ? html`${'\r\n'}${unsafeHTML(assignToSlot('suffix', args.suffix))}` : nothing
    }${args.hide ? html`${'\r\n'}${unsafeHTML(assignToSlot('hide', args.hide))}` : nothing}${
        args.show ? html`${'\r\n'}${unsafeHTML(assignToSlot('show', args.show))}` : nothing
    }</omni-pin-field>
  `,
    name: 'Interactive',
    args: {
        label: 'Label',
        value: '',
        hint: '',
        error: '',
        disabled: false,
        prefix: '',
        suffix: '',
        hide: '',
        show: ''
    },
    play: async (context) => {
        const pinField = within(context.canvasElement).getByTestId<PinField>('test-pin-field');
        pinField.value = '';

        const interactions = jest.fn();
        pinField.addEventListener('input', interactions);
        pinField.addEventListener('click', interactions);

        const inputField = pinField.shadowRoot?.getElementById('inputField') as HTMLInputElement;
        // Required to clear userEvent Symbol that keeps hidden state of previously typed values via userEvent. If not cleared this cannot be run multiple times with the same results
        setUIValueClean(inputField);

        const showSlotElement = pinField.shadowRoot?.querySelector<HTMLSlotElement>('slot[name=show]');
        await expect(showSlotElement).toBeTruthy();
        await userEvent.click(showSlotElement as HTMLSlotElement, {
            pointerEventsCheck: 0
        });
        const hideSlotElement = pinField.shadowRoot?.querySelector<HTMLSlotElement>('slot[name=hide]');
        await expect(hideSlotElement).toBeTruthy();
        await userEvent.click(hideSlotElement as HTMLSlotElement, {
            pointerEventsCheck: 0
        });

        await userEvent.type(inputField, '1234', {
            pointerEventsCheck: 0
        });
        const value = 1234;

        // Required to clear userEvent Symbol that keeps hidden state of previously typed values via userEvent. If not cleared this cannot be run multiple times with the same results
        setUIValueClean(inputField);

        await waitFor(() => expect(inputField).toHaveValue(value), {
            timeout: 3000
        });

        await waitFor(() => expect(interactions).toBeCalledTimes(value.toString().length + 1), {
            timeout: 3000
        });
    }
};

export const Label = LabelStory<PinField, BaseArgs>('omni-pin-field');

export const Hint = HintStory<PinField, BaseArgs>('omni-pin-field');

export const Error_Label = ErrorStory<PinField, BaseArgs>('omni-pin-field');

export const Value = ValueStory<PinField, BaseArgs>('omni-pin-field', 1234);

export const Prefix = PrefixStory<PinField, BaseArgs>('omni-pin-field');

export const Suffix = SuffixStory<PinField, BaseArgs>('omni-pin-field');

export const Disabled = DisabledStory<PinField, BaseArgs>('omni-pin-field', 1234);
