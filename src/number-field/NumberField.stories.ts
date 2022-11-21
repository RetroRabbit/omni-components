import { expect, jest } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';
import { Meta, StoryContext } from '@storybook/web-components';
import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
    LabelStory,
    BaseArgTypes,
    BaseArgTypeDefinitions,
    HintStory,
    ErrorStory,
    DisabledStory,
    ValueStory,
    PrefixStory,
    SuffixStory
} from '../core/OmniInputStories.js';
import { ifNotEmpty } from '../utils/Directives.js';
import { assignToSlot, loadCssPropertiesRemote } from '../utils/StoryUtils';
import { NumberField } from './NumberField.js';

import './NumberField.js';

export default {
    title: 'UI Components/Number Field',
    component: 'omni-number-field',
    argTypes: BaseArgTypeDefinitions,
    parameters: {
        cssprops: loadCssPropertiesRemote('omni-number-field'),
        actions: {
            handles: ['input']
        }
    }
} as Meta;

export const Interactive = {
    render: (args: BaseArgTypes) => html`
        <omni-number-field
            data-testid="test-number-field"
            label="${ifNotEmpty(args.label)}"
            .value="${args.value}"
            .data="${args.data}"
            hint="${ifNotEmpty(args.hint)}"
            error="${ifNotEmpty(args.error)}"
            ?disabled="${args.disabled}"
            >${args.prefix ? html`${'\r\n'}${unsafeHTML(assignToSlot('prefix', args.prefix))}` : nothing}${args.suffix
                ? html`${'\r\n'}${unsafeHTML(assignToSlot('suffix', args.suffix))}`
                : nothing}${args.prefix || args.suffix ? '\r\n' : nothing}
        </omni-number-field>
    `,
    name: 'Interactive',
    parameters: {},
    args: {
        label: 'Label',
        value: '',
        data: {},
        hint: '',
        error: '',
        disabled: false,
        prefix: '',
        suffix: ''
    },
    play: async (context: StoryContext) => {
        const numberField = within(context.canvasElement).getByTestId<NumberField>('test-number-field');
        const input = jest.fn();
        numberField.addEventListener('input', input);

        const inputField = numberField.shadowRoot.getElementById('inputField');

        const value = '12345';
        await userEvent.type(inputField, value);
        await expect(inputField).toHaveValue(parseInt(value));

        await expect(input).toBeCalledTimes(value.length);
    }
};

export const Label = LabelStory<NumberField, BaseArgTypes>('omni-number-field');

export const Hint = HintStory<NumberField, BaseArgTypes>('omni-number-field');

export const ErrorLabel = ErrorStory<NumberField, BaseArgTypes>('omni-number-field');

export const Value = ValueStory<NumberField, BaseArgTypes>('omni-number-field', 123);

export const Prefix = PrefixStory<NumberField, BaseArgTypes>('omni-number-field');

export const Suffix = SuffixStory<NumberField, BaseArgTypes>('omni-number-field');

export const Disabled = DisabledStory<NumberField, BaseArgTypes>('omni-number-field');