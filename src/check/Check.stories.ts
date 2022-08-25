import { html, TemplateResult } from 'lit';
import { Meta } from '@storybook/web-components';
import { loadCssPropertiesRemote } from '../utils/StoryUtils';
import './Check.js';

export default {
  title: 'UI Components/Check',
  component: 'omni-check',
  argTypes: {},
  parameters: {
    actions: {
      handles: ['value-change'],
    },
    cssprops: loadCssPropertiesRemote('omni-check'),
  },
} as Meta;

interface ArgTypes {
  label: string;
  data: object;
  hint: string;
  error: string;
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;

  check_icon: TemplateResult;
  indeterminate_icon: TemplateResult;
}

export const Default = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" .data="${args.data}" hint="${args.hint}"
      error="${args.error}" ?checked="${args.checked}" ?disabled="${args.disabled}" ?indeterminate="${args.indeterminate}">
    </omni-check>
  `,
  name: 'Default',
  parameters: {},
  args: {
    label: '',
    data: {},
    hint: '',
    error: '',
    checked: false,
    disabled: false,
    indeterminate: false,
  },
};

export const Label = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}"></omni-check>
  `,
  args: {
    label: 'Label'
  },
};

export const Hint = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" hint="${args.hint}"></omni-check>
  `,
  args: {
    label: 'Hint',
    hint: 'This is a hint'
  },
};

export const Error = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" error="${args.error}"></omni-check>
  `,
  args: {
    label: 'Error',
    error: 'This is an error state'
  },
};

export const Checked = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" ?checked="${args.checked}"></omni-check>
  `,
  args: {
    label: 'Checked',
    checked: true
  },
};

export const Indeterminate = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" ?indeterminate="${args.indeterminate}"></omni-check>
  `,
  args: {
    label: 'Indeterminate',
    indeterminate: true,
  },
};

export const Disabled = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" ?disabled="${args.disabled}"></omni-check>
  `,
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const CustomCheckIcon = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" ?checked="${args.checked}">
      ${args.check_icon} ${args.indeterminate_icon}
    </omni-check>
  `,
  args: {
    label: 'Custom Check Icon',
    checked: true,
    check_icon: html`<svg slot="check_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 442.79 410.38" version="1.0" width="100%"
                      height="100%">
                      <path style="stroke:#000;stroke-width:19.892;fill:#139e1c"
                        d="m-1747.2-549.3 287.72 333.9c146.6-298.83 326.06-573.74 614.52-834.75-215.89 121.82-453.86 353.14-657.14 639.38l-245.1-138.53z"
                        transform="translate(843.77 509.04) scale(.48018)" />
                    </svg>`,
  },
};

export const CustomIndeterminateIcon = {
  render: (args: ArgTypes) => html`
    <omni-check data-testid="test-check" label="${args.label}" ?indeterminate="${args.indeterminate}">
      ${args.check_icon} ${args.indeterminate_icon}
    </omni-check>
  `,
  args: {
    label: 'Custom Indeterminate Icon',
    indeterminate: true,
    indeterminate_icon: html`<svg slot="indeterminate_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
                              <defs>
                                <linearGradient id="b" y2="28.275" gradientUnits="userSpaceOnUse" x2="20.07" y1="3.976" x1="12.113">
                                  <stop style="stop-color:#525bc6" offset="0" />
                                  <stop style="stop-color:#6f76db" offset="1" />
                                </linearGradient>
                                <linearGradient id="a" y2="30" gradientUnits="userSpaceOnUse" x2="20.214" y1="2" x1="12.031">
                                  <stop style="stop-color:#20286d" offset="0" />
                                  <stop style="stop-color:#0b102f" offset="1" />
                                </linearGradient>
                              </defs>
                              <path d="M2.875 13C1.281 13 0 14.338 0 16s1.28 3 2.875 3h26.25C30.719 19 32 17.662 32 16s-1.281-3-2.875-3H2.875z" />
                              <path style="fill:url(#b)" transform="translate(-.063 .063)"
                                d="M2.875 13.938c-1.067 0-1.938.884-1.938 2.062s.87 2.062 1.938 2.062h26.25c1.067 0 1.937-.884 1.937-2.062s-.87-2.062-1.937-2.062H2.875z" />
                            </svg>`,
  },
};
